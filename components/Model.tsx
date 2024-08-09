import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import { GLTF } from "three-stdlib"; // Add this import


// Define a custom GLTF type interface
interface CustomGLTF extends GLTF {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  animations: any[];
}

useGLTF.preload("/buster_drone.glb");

interface ModelProps {
  isMobile: boolean;
}

export default function Model({ isMobile }: ModelProps) {
  const group = useRef<Group>(null);
  const modelPosition = useRef<Vector3>(new Vector3(10, 0.16, 10)); // Initial position for web
  const { nodes, materials, animations, scene } = useGLTF("/buster_drone.glb") as CustomGLTF;
  const { actions } = useAnimations(animations, scene);
  const liftoffAction = actions ? actions["Start_Liftoff"] : null;
  const scroll = useScroll();
  const { viewport } = useThree();

  useEffect(() => {
    if (liftoffAction) {
      liftoffAction.play();
    } else {
      console.warn("Animation 'Start_Liftoff' not found.");
    }

    // Set the initial position and scale of the model
    if (group.current) {
      if (isMobile) {
        const mobileX = 0 + viewport.width / 4;
        const mobileY = 0 + viewport.height / 4;
        modelPosition.current.set(mobileX, mobileY, -5);
        group.current.position.copy(modelPosition.current);
        group.current.scale.set(0.1, 0.2, 0.1);
      } else {
        group.current.position.copy(modelPosition.current);
        group.current.scale.set(0.8, 0.8, 0.8);
      }
    }
  }, [liftoffAction, isMobile, viewport]);

  useFrame((state, delta) => {
    if (liftoffAction) {
      const clipDuration = liftoffAction.getClip().duration;
      liftoffAction.time = (liftoffAction.time + delta) % clipDuration;
    }

    if (group.current) {
      if (isMobile) {
        // Mobile: Update model position based on scroll and viewport
        const scrollMultiplier = 10; // Increase this value to make movement more dramatic
        const targetX = 0 + viewport.width / 4 + scroll.offset * scrollMultiplier * viewport.width;
        const targetY = 0 + viewport.height / 4 + scroll.offset * scrollMultiplier * viewport.height / 2;

        // Clamp targetX and targetY to keep the drone on screen
        const clampedX = Math.max(-viewport.width / 2, Math.min(viewport.width / 2, targetX));
        const clampedY = Math.max(-viewport.height / 2, Math.min(viewport.height / 2, targetY));

        // Smoothly interpolate position
        modelPosition.current.lerp(new Vector3(0.5 + clampedX + scroll.offset * 10, -0.5 + clampedY + scroll.offset * 10, -5), 0.03);
        group.current.position.copy(modelPosition.current);
        // console.log(modelPosition)
        // Smoothly interpolate scale
        const targetScale = 0.3;
        group.current.scale.lerp(new Vector3(targetScale + 0.2, targetScale + 0.2, targetScale + 0.2), 0.1);

        // Adjust rotation for mobile
        const targetRotationY = -Math.PI / 3;
        group.current.rotation.y += (targetRotationY - group.current.rotation.y) * 0.1;
      } else {
        // Web: Update model position based on original logic
        const x = 1 + scroll.offset * 20;
        const y = -0.5;
        modelPosition.current.set(x, y, -5);
        group.current.position.copy(modelPosition.current);
      }
    }
  });

  return (
    <group ref={group} dispose={null} rotation={[0, isMobile ? 0 : -Math.PI * 40 / 180, 0]}>
      <primitive object={scene} />
    </group>
  );
}