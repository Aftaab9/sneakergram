/**
 * Parallax utility functions for 3D landing page
 */

export interface MousePosition {
  x: number;
  y: number;
}

export interface ParallaxRotation {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculate parallax rotation based on mouse/touch position
 * 
 * @param mousePosition - Normalized mouse position (-1 to 1 for both x and y)
 * @returns Rotation values for x, y, and z axes
 */
export function calculateParallaxRotation(mousePosition: MousePosition): ParallaxRotation {
  // Apply parallax effect with different intensities for each axis
  const rotationX = mousePosition.y * 0.3;
  const rotationZ = mousePosition.x * 0.1;
  
  return {
    x: rotationX,
    y: 0, // Y rotation is handled by auto-rotation
    z: rotationZ,
  };
}

/**
 * Normalize screen coordinates to -1 to 1 range
 * 
 * @param clientX - X coordinate from mouse/touch event
 * @param clientY - Y coordinate from mouse/touch event
 * @param screenWidth - Width of the screen
 * @param screenHeight - Height of the screen
 * @returns Normalized mouse position
 */
export function normalizeMousePosition(
  clientX: number,
  clientY: number,
  screenWidth: number,
  screenHeight: number
): MousePosition {
  // Clamp coordinates to screen bounds first
  const clampedX = Math.max(0, Math.min(clientX, screenWidth));
  const clampedY = Math.max(0, Math.min(clientY, screenHeight));
  
  // Normalize to -1 to 1 range
  const x = (clampedX / screenWidth) * 2 - 1;
  const y = -(clampedY / screenHeight) * 2 + 1;
  
  return { x, y };
}

/**
 * Validate that mouse position is within expected bounds
 * 
 * @param mousePosition - Mouse position to validate
 * @returns True if position is valid (between -1 and 1)
 */
export function isValidMousePosition(mousePosition: MousePosition): boolean {
  return (
    mousePosition.x >= -1 &&
    mousePosition.x <= 1 &&
    mousePosition.y >= -1 &&
    mousePosition.y <= 1
  );
}
