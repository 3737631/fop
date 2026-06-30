import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  progress: number;
}

export default function ThreeBulb({ progress }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    filament: THREE.Mesh;
    bulbMesh: THREE.Mesh;
    cap: THREE.Mesh;
    clock: THREE.Clock;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    const bulbGroup = new THREE.Group();

    const glassPoints: THREE.Vector2[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI;
      const x = 0.8 * Math.sin(angle) + 0.05;
      const y = t * 2 - 1;
      glassPoints.push(new THREE.Vector2(x * 0.6, y * 1.0 + 0.3));
    }
    const glassGeom = new THREE.LatheGeometry(glassPoints, 48);

    const glassMat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const bulbMesh = new THREE.Mesh(glassGeom, glassMat);
    bulbGroup.add(bulbMesh);

    const filamentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.8, 0.2, 0.05),
      emissive: new THREE.Color(0.6, 0.1, 0.0),
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.7,
    });

    const filamentGroup = new THREE.Group();
    const helixPoints: THREE.Vector3[] = [];
    const turns = 6;
    const heightTotal = 0.8;
    const radius = 0.12;

    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const angle = t * turns * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = t * heightTotal - 0.4;
      helixPoints.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(helixPoints);
    const tubeGeom = new THREE.TubeGeometry(curve, 120, 0.015, 6, false);
    const filament = new THREE.Mesh(tubeGeom, filamentMat);
    filamentGroup.add(filament);

    const crossMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.9, 0.3, 0.05),
      emissive: new THREE.Color(0.6, 0.1, 0.0),
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.8,
    });

    for (let i = -1; i <= 1; i += 2) {
      const supportPoints: THREE.Vector3[] = [
        new THREE.Vector3(i * 0.05, -0.45, 0),
        new THREE.Vector3(i * 0.15, -0.1, 0),
        new THREE.Vector3(i * 0.12, 0.0, 0),
        new THREE.Vector3(i * 0.08, 0.2, 0),
        new THREE.Vector3(i * 0.04, 0.4, 0),
      ];
      const supportCurve = new THREE.CatmullRomCurve3(supportPoints);
      const supportGeom = new THREE.TubeGeometry(supportCurve, 30, 0.008, 4, false);
      const support = new THREE.Mesh(supportGeom, crossMat);
      filamentGroup.add(support);
    }

    bulbGroup.add(filamentGroup);

    const capGeom = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.6, 0.5, 0.3),
      roughness: 0.6,
      metalness: 0.8,
    });
    const cap = new THREE.Mesh(capGeom, capMat);
    cap.position.y = -0.72;
    bulbGroup.add(cap);

    const ringGeom = new THREE.TorusGeometry(0.52, 0.03, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.5, 0.4, 0.2),
      roughness: 0.7,
      metalness: 0.6,
    });

    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = -0.74 + i * 0.06;
      ring.rotation.x = Math.PI / 2;
      bulbGroup.add(ring);
    }

    scene.add(bulbGroup);

    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1);
    rimLight.position.set(0, -1, -3);
    scene.add(rimLight);

    const clock = new THREE.Clock();

    sceneRef.current = {
      scene, camera, renderer, filament, bulbMesh, cap, clock,
    };

    const animate = () => {
      const ctx = sceneRef.current;
      if (!ctx) return;
      const delta = clock.getDelta();

      bulbGroup.rotation.y += delta * 0.15;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      sceneRef.current.renderer.setSize(w, h);
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;

    const filamentMat = ctx.filament.material as THREE.MeshStandardMaterial;
    const bulbMat = ctx.bulbMesh.material as THREE.MeshPhysicalMaterial;

    const intensity = 0.3 + progress * 4.0;
    const r = 0.8 + progress * 1.2;
    const g = 0.2 + progress * 0.8;
    const b = 0.05 + progress * 0.9;

    filamentMat.color.setRGB(r, g, b);
    filamentMat.emissive.setRGB(
      0.6 + progress * 3.0,
      0.1 + progress * 1.5,
      0.0 + progress * 0.3
    );
    filamentMat.emissiveIntensity = intensity;

    bulbMat.opacity = 0.25 + progress * 0.15;

    const emissiveColor = new THREE.Color();
    emissiveColor.setHSL(0.1 - progress * 0.08, 1, progress * 0.3);
    bulbMat.emissive = emissiveColor;
    bulbMat.emissiveIntensity = progress * 0.5;
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[600px] mx-auto aspect-square rounded-2xl overflow-hidden"
    />
  );
}
