import { Html, useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, MeshStandardMaterial, Color } from "three";
import { GLTF } from "three-stdlib"; // Add this import

interface CustomGLTF extends GLTF {
  nodes: Record<string, any>;
  materials: Record<string, any>;
  animations: any[];
}

useGLTF.preload("/drone.glb");

interface DroneModelProps {
  isMobile: boolean;
}

export default function DroneModel({ isMobile }: DroneModelProps) {
  const group = useRef<Group>(null);
  const initialPosition = new Vector3(5, -6, -5); // Center position
  const { nodes, materials, animations, scene } = useGLTF("/drone.glb") as CustomGLTF;
  const { actions } = useAnimations(animations, scene);
  const scroll = useScroll();

  useEffect(() => {
    // Play hover animation if available
    const hoverAnimation = actions ? actions["hover"] : null;
    if (hoverAnimation) {
      hoverAnimation.play();
    } else {
      console.log("Available actions:", actions);
      console.warn("Animation 'hover' not found.");
    }

    // Set the initial position and scale of the model based on device type
    if (group.current) {
      group.current.position.copy(initialPosition);
      group.current.scale.set(isMobile ? 0.7: 1.1, isMobile ? 0.7 : 1.1, isMobile ?0.7: 1.1);
    }

    // Configure materials to respond to the environment map
    for (const materialName in materials) {
      const material = materials[materialName] as MeshStandardMaterial;
      if (material) {
        material.metalness = 0.9;
        material.roughness = 0.1;
        material.envMapIntensity = 50000;
        material.color = new Color('#73B8EF');
      }
    }
  }, [actions, isMobile, materials]);
  useFrame(() => {
    if (group.current) {
      const scrollOffset = scroll.offset; // Get scroll offset

      // Update position based on scroll
      const newPosition = initialPosition.clone();
      // console.log(newPosition)
      newPosition.x = isMobile ? -2.75 + scrollOffset * 5 : -20 + scrollOffset * 50; // Adjust the horizontal movement range for mobile
      newPosition.y = isMobile ? -6 + scrollOffset * 10 : -2.5; // Adjust the vertical movement range for mobile
      group.current.position.copy(newPosition);
    }
  });

  return (
    <group ref={group} dispose={null} rotation={[0, Math.PI * 40 / 180, 0]}>
      <primitive className="drone" object={scene} />
    </group>
  );
}
