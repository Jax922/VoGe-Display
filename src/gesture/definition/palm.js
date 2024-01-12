
import * as fp from '../../fingerpose'

// describe pointing gesture
const palmDescription = new fp.GestureDescription("palm");

// thumb
palmDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);

// index finger
// palmDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 0.9);
// palmDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 0.9);


// middle finger
// palmDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 0.9);
// palmDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 0.9);

// ring finger
// palmDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
// twoPointDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 0.9);

// pinky finger
palmDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
// twoPointDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

export default palmDescription;