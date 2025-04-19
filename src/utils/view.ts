/**
 * Calculates the optimal viewing distance for a 3D object based on FOV and window size
 * @param fov Field of View angle in degrees
 * @param windowWidth Window width in pixels
 * @param windowHeight Window height in pixels
 * @param objectSize Size of the object (width, height, depth) in world units
 * @returns Optimal viewing distance in world units
 */
export function calculateViewDistance(
  fov: number,
  windowWidth: number,
  windowHeight: number,
  objectSize: { width: number; height: number; depth: number },
): number {
  const vFOV = (fov * Math.PI) / 180;

  const aspectRatio = windowWidth / windowHeight;

  const vRatio = 2 * Math.tan(vFOV / 2);
  const hRatio = vRatio * aspectRatio;

  const heightDistance = objectSize.height / vRatio;
  const widthDistance = objectSize.width / hRatio;

  const distance = Math.max(heightDistance, widthDistance);

  const safetyMargin = 1.2;

  return distance * safetyMargin;
}

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};
