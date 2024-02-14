
import * as fp from '../../fingerpose'

// describe pointing gesture
const twoPointDescription = new fp.GestureDescription("twopoint");

// thumb

// // index finger
// twoPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 0.9);
// twoPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);


// // middle finger
// twoPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 0.9);
// twoPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// // ring finger
// twoPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
// // twoPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// // pinky finger
// twoPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
// twoPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

const Finger = fp.Finger;
const FingerCurl = fp.FingerCurl;
const FingerDirection = fp.FingerDirection;

// thumb:
twoPointDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
twoPointDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);
twoPointDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 1.0);

// index:
twoPointDescription.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
twoPointDescription.addDirection(Finger.Index, FingerDirection.VerticalUp, 1.0);
twoPointDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);
twoPointDescription.addDirection(Finger.Index, FingerDirection.DiagonalUpRight, 1.0);
twoPointDescription.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 1.0);
twoPointDescription.addDirection(Finger.Index, FingerDirection.HorizontalRight, 1.0);

// middle:
twoPointDescription.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
twoPointDescription.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
twoPointDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 1.0);
twoPointDescription.addDirection(Finger.Middle, FingerDirection.DiagonalUpRight, 1.0);
twoPointDescription.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 1.0);
twoPointDescription.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 1.0);

// ring:
twoPointDescription.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
twoPointDescription.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky:
twoPointDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
twoPointDescription.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);


export default twoPointDescription;