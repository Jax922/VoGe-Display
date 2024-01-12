
import * as fp from '../../fingerpose'

// describe pointing gesture
const horizontalPalmDescription = new fp.GestureDescription("point");

// thumb
// // pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
// // pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
horizontalPalmDescription.addDirection(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);


// index finger
horizontalPalmDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);

// middle finger
horizontalPalmDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// ring finger
horizontalPalmDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// pinky finger
horizontalPalmDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

export default horizontalPalmDescription;