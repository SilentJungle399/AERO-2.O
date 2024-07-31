import { forwardRef } from 'react';
import { ScrollControls } from '@react-three/drei';

const ScrollControlsRef = forwardRef(({ enabled, children }, ref) => (
  <ScrollControls
    ref={ref}
    enable={enabled}
  >
    {children}
  </ScrollControls>
));

export default ScrollControlsRef;
