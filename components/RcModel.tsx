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

useGLTF.preload("/rc_plane.glb");

interface RcModelProps {
  isMobile: boolean;
  scale?: [number, number, number];
}

export default function RcModel({ isMobile, scale = [2.1, 2.1, 2.1] }: RcModelProps) {
  const group = useRef<Group>(null);
  const initialPosition = useRef(new Vector3(-7.5, 0.2, -100)); // Initial position
  const targetPosition = useRef(new Vector3(-7.5, 0.2, 1)); // Target position based on scroll
  const { nodes, materials, animations, scene } = useGLTF("/rc_plane.glb") as CustomGLTF;
  const { actions } = useAnimations(animations, scene);
  const scroll = useScroll();

  useEffect(() => {
    // Log available actions
    const Idle_Scan = actions ? actions["Take 001"] : null;
    if (Idle_Scan) {
      Idle_Scan.play();
    } else {
      console.log("Available actions:", actions);
      console.warn("Animation 'Take 001' not found.");
    }

    // Set the initial position and scale of the model
    if (group.current) {
      group.current.position.copy(initialPosition.current);
      group.current.scale.set(
        isMobile ? scale[0] * 0.5 : scale[0],
        isMobile ? scale[1] * 0.5 : scale[1],
        isMobile ? scale[2] * 0.5 : scale[2]
      );
    }
  }, [actions, scale, isMobile]);

  useFrame(() => {
    if (group.current) {
      const scrollOffset = scroll.offset; // Get scroll offset

      // Update target position based on scroll
      targetPosition.current.x = isMobile ? -13+ scrollOffset * 20 : -23 + scrollOffset * 41; // Adjust the horizontal movement range for mobile
      targetPosition.current.y = isMobile ? -4.5 + scrollOffset * 4 : -2 + scrollOffset * 1.5; // Adjust the vertical movement range for mobile
      if(isMobile){
        // console.log(targetPosition.current.x)
        // console.log(targetPosition.current.y)
      }
      // Lerp towards the target position
      group.current.position.lerp(targetPosition.current, 0.1);
    }
  });

  return (
    <group ref={group} dispose={null} rotation={[Math.PI *10 / 180, Math.PI * 60 / 180, Math.PI * 20 / 180]}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}
