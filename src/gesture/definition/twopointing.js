
import * as fp from '../../fingerpose'

// describe pointing gesture
const twoPointDescription = new fp.GestureDescription("twopoint");

// thumb

// index finger
twoPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 0.9);
twoPointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);


// middle finger
twoPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 0.9);
twoPointDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// ring finger
twoPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
// twoPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// pinky finger
twoPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
// twoPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

export default twoPointDescription;