
import * as fp from '../../fingerpose'

// describe pointing gesture
const pointDescription = new fp.GestureDescription("point");

// thumb
// pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
// pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
// pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);

// index finger
pointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
pointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 1.0);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 1.0);

// middle finger
pointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
pointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// ring finger
pointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
pointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// pinky finger
pointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
pointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

export default pointDescription;