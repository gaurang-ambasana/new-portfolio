"use client";

import { type FC, useEffect, useRef } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  FogExp2,
  TubeGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  BoxGeometry,
  Color,
  Vector3,
  ACESFilmicToneMapping,
  SRGBColorSpace,
  Vector2,
  Mesh,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import spline from "./spline";

const WormholeBackground: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const controlsRef = useRef<typeof OrbitControls>(null);
  const composerRef = useRef<typeof EffectComposer>(null);
  const sceneRef = useRef<Scene>(null);
  const cameraRef = useRef<PerspectiveCamera>(null);
  const rendererRef = useRef<WebGLRenderer>(null);
  const tubeLinesRef = useRef<LineSegments>(null);
  const boxesRef = useRef<LineSegments[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new Scene();
    scene.fog = new FogExp2(0x000000, 0.3);
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.03;
    controlsRef.current = controls;

    const tubeGeo = new TubeGeometry(spline, 222, 0.65, 16, true);
    const edges = new EdgesGeometry(tubeGeo, 0.2);
    const lineMat = new LineBasicMaterial({ color: 0xff0000 });
    const tubeLines = new LineSegments(edges, lineMat);
    scene.add(tubeLines);
    tubeLinesRef.current = tubeLines;

    const numBoxes = 55;
    const size = 0.075;
    const boxGeo = new BoxGeometry(size, size, size);
    boxesRef.current = [];

    for (let i = 0; i < numBoxes; i += 1) {
      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeo.parameters.path.getPointAt(p);
      pos.x += Math.random() - 0.4;
      pos.z += Math.random() - 0.4;

      const rote = new Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const edges = new EdgesGeometry(boxGeo, 0.2);
      const color = new Color().setHSL(0.7 - p, 1, 0.5);
      const lineMat = new LineBasicMaterial({ color });
      const boxLines = new LineSegments(edges, lineMat);

      boxLines.position.copy(pos);
      boxLines.rotation.set(rote.x, rote.y, rote.z);
      scene.add(boxLines);
      boxesRef.current.push(boxLines);
    }

    const composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(width, height),
      1.5,
      0.4,
      100
    );
    bloomPass.threshold = 0.002;
    bloomPass.strength = 3.5;
    bloomPass.radius = 0;

    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const animate = (t: number) => {
      requestRef.current = requestAnimationFrame(animate);
      updateCamera(t);
      controls.update();
      composer.render();
    };
    animate(0);

    const handleResize = () => {
      if (
        !mountRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !composerRef.current
      )
        return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      composerRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      scene.traverse((child) => {
        if (child instanceof Mesh || child instanceof LineSegments) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      composerRef.current?.dispose();
    };
  }, []);

  const updateCamera = (t: number) => {
    if (!cameraRef.current) return;

    const time = t * 0.1;
    const looptime = 10 * 1000;
    const p = (time % looptime) / looptime;
    const tubeGeo = new TubeGeometry(spline, 222, 0.65, 16, true);

    const pos = tubeGeo.parameters.path.getPointAt(p);
    const centerSamplePoints = 5;
    const center = new Vector3();

    for (let i = 0; i < centerSamplePoints; i++) {
      const samplePoint = tubeGeo.parameters.path.getPointAt(
        (p + (i / centerSamplePoints) * 0.1) % 1
      );
      center.add(samplePoint);
    }
    center.divideScalar(centerSamplePoints);

    cameraRef.current.position.copy(pos);

    cameraRef.current.lookAt(center);

    cameraRef.current.position.lerp(pos, 0.1);
  };

  return (
    <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-[-1]" />
  );
};

export default WormholeBackground;
