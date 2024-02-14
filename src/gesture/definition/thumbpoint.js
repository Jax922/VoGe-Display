
import * as fp from '../../fingerpose'

// describe pointing gesture
const thumbPointDescription = new fp.GestureDescription("thumb-point");

// thumb
// thumbPointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
// thumbPointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
thumbPointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);
// thumbPointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
// thumbPointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
// thumbPointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);

// index finger
thumbPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
thumbPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);
thumbPointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
thumbPointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 1.0);
thumbPointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 1.0);

// middle finger
thumbPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
thumbPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// ring finger
thumbPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
thumbPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// pinky finger
thumbPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
thumbPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

export default thumbPointDescription;