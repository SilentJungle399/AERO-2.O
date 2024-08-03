import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { GLTF } from "three-stdlib"; // Add this import


// Define a custom GLTF type interface
interface CustomGLTF extends GLTF {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  animations: any[];
}

useGLTF.preload("/Eyemodel.glb");

interface EyeModelProps {
  isMobile: boolean;
  scale?: [number, number, number];
}

export default function EyeModel({ isMobile, scale = [0.5, 0.5, 0.5] }: EyeModelProps) {
  const group = useRef<Group>(null);
  const initialPosition = useRef(new Vector3(6.6, 0.9, 0)); // Initial position
  const targetPosition = useRef(new Vector3(5.6, 0.9, 0)); // Target position based on scroll
  const { nodes, materials, animations, scene } = useGLTF("/Eyemodel.glb") as CustomGLTF;
  const { actions } = useAnimations(animations, scene);
  const Idle_Scan = actions ? actions["Idle_Scan"] : null;
  const scroll = useScroll();

  useEffect(() => {
    if (Idle_Scan) {
      Idle_Scan.play();
    } else {
      console.warn("Animation 'Idle_Scan' not found.");
    }

    // Set the initial position and scale of the model
    if (group.current) {
      group.current.position.copy(initialPosition.current);
      group.current.scale.set(
        isMobile ? scale[0] * 0.7 : scale[0],
        isMobile ? scale[1] * 0.7 : scale[1],
        isMobile ? scale[2] * 0.7 : scale[2]
      );
    }
  }, [Idle_Scan, scale, isMobile]);

  useFrame(() => {
    if (group.current) {
      const scrollOffset = scroll.offset; // Get scroll offset

      // Update target position based on scroll
      targetPosition.current.x = isMobile ? 6.3 + - scrollOffset * 10 : 5.6 - scrollOffset * 15; // Adjust horizontal movement range for mobile
      targetPosition.current.y = isMobile ?  1.4+ scrollOffset * 10 : 0.9 + scrollOffset * 15; // Adjust vertical movement range for mobile
      console.log(targetPosition.current.x)
      console.log(targetPosition.current.y)
      // Lerp towards the target position
      group.current.position.lerp(targetPosition.current, 0.1);
    }
  });

  return (
    <group ref={group} dispose={null} rotation={[0, Math.PI * 40 / 180, 0]}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}
