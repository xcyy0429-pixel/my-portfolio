import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// React Bits' band texture (CDN-hosted) — gives the woven-strap look
const BAND_TEX_URL =
  'https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpeg';

/**
 * Generates a card front texture from a Canvas:
 * white card → top accent → photo → name → role
 */
function useCardTexture(photoUrl, name, role) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const W = 512;
    const H = 720;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const draw = (img) => {
      // Card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Top accent strip
      ctx.fillStyle = '#7F77DD';
      ctx.fillRect(0, 0, W, 14);

      // Subtle border
      ctx.strokeStyle = 'rgba(10,10,10,0.08)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, H - 2);

      // Photo area
      const px = 56,
        py = 56,
        pw = W - 112,
        ph = 480;

      ctx.fillStyle = '#f3f3f1';
      ctx.fillRect(px, py, pw, ph);

      if (img) {
        // Cover-fit
        const ratioImg = img.width / img.height;
        const ratioBox = pw / ph;
        let sx, sy, sw, sh;
        if (ratioImg > ratioBox) {
          sh = img.height;
          sw = sh * ratioBox;
          sx = (img.width - sw) / 2;
          sy = 0;
        } else {
          sw = img.width;
          sh = sw / ratioBox;
          sx = 0;
          sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, px, py, pw, ph);
      }

      // Name
      ctx.fillStyle = '#0a0a0a';
      ctx.font =
        'bold 52px "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(name, W / 2, 568);

      // Role
      ctx.fillStyle = '#7F77DD';
      ctx.font =
        '500 26px "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif';
      ctx.fillText(role, W / 2, 638);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 16;
      tex.needsUpdate = true;
      setTexture(tex);
    };

    if (photoUrl) {
      const img = new Image();
      img.onload = () => draw(img);
      img.onerror = () => {
        console.warn('[Lanyard] photo failed to load:', photoUrl);
        draw(null);
      };
      img.src = photoUrl;
    } else {
      draw(null);
    }
  }, [photoUrl, name, role]);

  return texture;
}

export default function Lanyard({
  photo,
  name = '陈阳',
  role = '不动产登记专员',
}) {
  return (
    <div className="lanyard">
      <Canvas
        camera={{ position: [0, -0.5, 20], fov: 25 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), 0)
        }
      >
        <ambientLight intensity={Math.PI * 0.6} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band photo={photo} name={name} role={role} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ photo, name, role, maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const bandTexture = useTexture(BAND_TEX_URL);
  const cardTexture = useCardTexture(photo, name, role);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    0.5,
  ]);
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    0.5,
  ]);
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    0.5,
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 4.35, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec
        .set(state.pointer.x, state.pointer.y, 0.5)
        .unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z,
      });
    }
  });

  curve.curveType = 'chordal';
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[2.4, 3.375, 0.06]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            {/* Card body — 3× scale */}
            <mesh>
              <boxGeometry args={[4.8, 6.75, 0.12]} />
              {cardTexture ? (
                <meshPhysicalMaterial
                  map={cardTexture}
                  clearcoat={0.6}
                  clearcoatRoughness={0.15}
                  roughness={0.4}
                  metalness={0.05}
                />
              ) : (
                <meshPhysicalMaterial
                  color="#ffffff"
                  clearcoat={0.6}
                  clearcoatRoughness={0.15}
                  roughness={0.4}
                  metalness={0.05}
                />
              )}
            </mesh>

            {/* Top metal clip (ring) — 3× position & size */}
            <mesh position={[0, 3.54, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.24, 0.066, 12, 24]} />
              <meshStandardMaterial
                color="#c8c8c8"
                metalness={0.95}
                roughness={0.25}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Lanyard band */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#7F77DD"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap
          map={bandTexture}
          repeat={[-3, 1]}
          lineWidth={0.6}
        />
      </mesh>
    </>
  );
}
