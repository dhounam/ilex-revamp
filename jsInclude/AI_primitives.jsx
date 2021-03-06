﻿/* AI primitives file

Created 29/06/05
Updated 21/01/09 (myText calls doTextTweaks in site-specific module)

This file contains functions to create "primitives" -- Illustrator page items:
- makeRect: 		Rectangles
- makeEllipse:	Ellipses
- makeWedge:		Wedges
- makeLine:		Line paths
- makeText

Also contains sub-functions (called from top-level object-creating functions):
- setPathAttributes: sets fill, stroke and ID attributes
- setAttributeError: notifies of any error setting attributes (called from item-creating function)
- itemError: notifies any error drawing item (called from code that called the iten-creating function)
	--- itemError is not currently called from anything!! ---
- wrapText: called from makeText, to scale and wrap text ranges

- fineTuneOrigin: compensates for disparity between text range origin and
	actual left/right...

*/


/* ----- Top-level primitives -----
RECTANGLE, CIRCLE, LINE, TEXT AI primitives
*/

// $.level=1;


// MAKE RECT
// Args are	context, points array (top, left, width, height),
//			fill flag, fill colour array (c,m,y,k),
//			stroke flag, stroke width, stroke colour array (c,m,y,k),
//			object name; object note string
//			stroke dash; rotation
function makeRect(docRef,rectPath,fFlag,fCols,sFlag,sWidth,sCols,rectName,rectNote,sDash,rotateBy,isHidden)
{
	// if (!(rotateBy==undefined)) {listArgs(arguments)}
	var xCa;
	var yCa;
	var xCb;
	var yCb;
	var cMove;
	try {
		// Draw the path
		// rectangle params are top, left, width, height
		var pathRef = docRef.pathItems.rectangle(rectPath[0],rectPath[1],rectPath[2],rectPath[3],);
		// Rotation
		if (!(rotateBy == undefined)) {
			// There's some sort of rotation bug in Illy, whereby it doesn't seem to rotate
			// by its true centre (unless it's at 0,0!)
			// So I note current centre, rotate and force the centre back to where I want it
			// But I can only do this if strokWidth is zero, so...
			// (final sW is set by setPathAttributes, called just below)
			pathRef.strokeWidth = 0;
			// Remember current centre
			xCa = pathRef.left + (pathRef.width/2);
			yCa = pathRef.top - (pathRef.height/2);
			// Rotate (position will change)
			pathRef.rotate(rotateBy, true, undefined, undefined, undefined, Transformation.CENTER);
			// Get new centre
			xCb = pathRef.left + (pathRef.width/2);
			yCb = pathRef.top - (pathRef.height/2);
			cMove = xCa - xCb;
			pathRef.left += cMove;
			cMove = yCa - yCb;
			pathRef.top += cMove;
			// Which leaves unstroked path in (hopefully) correct position
		}

		// Sub-function sets other attributes (fill, stroke, ID)
		// (So overrides zero stroke set by any rotation)
		if (!setPathAttributes(pathRef,fFlag,fCols,sFlag,sWidth,sCols,
			c_defaultLineEnd,c_defaultLineMiter,c_defaultLineMiterLimit,rectName,rectNote,sDash,isHidden)) {
			// To prevent repeated error reports:
			if (!g_primitiveError) {
				setAttributeError(rectNote);
				g_primitiveError = true;
			}
		}
	}
	catch (err) {
		// If an error occurs, I check the flag. If this is the first error of this type, I sound the alarm
		// But reset the flag to prevent the error being repeated
		if (!g_primitiveError) {
			myAlert("This error occurred when " + c_I + " tried to draw item " + rectName + " (from makeRect)", err);
			g_primitiveError = true;
		}
	}
	// Return path item:
	return pathRef;
}
// MAKE RECT ends

// ELLIPSE function
// Args are 	document, points array (x, y), width, height,
//			fill flag, fill colour array (c,m,y,k),
//			stroke flag, stroke width, stroke colour array (c,m,y,k),
//			object name; object note string
//			stroke dash
function makeEllipse(docRef,ellPos,w,h,fFlag,fCols,sFlag,sWidth,sCols,ellName,ellNote,sDash)
{
	// listArgs(arguments)
	var pathRef;
	var top;
	var left;
	try {
		// I've been passed centre-coords (x,y) -- convert these to top and left
		top = ellPos[1] + (h / 2);
		left = ellPos[0] - (w / 2);
		// Draw the path
		pathRef = docRef.pathItems.ellipse(top,left,w,h,);
		// Sub-function sets other attributes (fill, stroke, ID)
		if (!setPathAttributes(pathRef,fFlag,fCols,sFlag,sWidth,sCols,
			c_defaultLineEnd,c_defaultLineMiter,c_defaultLineMiterLimit,ellName,ellNote,sDash)) {
			if (!g_primitiveError) {
				setAttributeError(ellNote);
				g_primitiveError = true;
			}
		}
	}
	catch (err) {
		if (!g_primitiveError) {
			myAlert("This error occurred when " + c_I + " tried to draw item " + ellName + " (from makeEllipse)", err);
			g_primitiveError = true;
		}
	}
	return pathRef;
}
// MAKE ELLIPSE ends


// MAKE WEDGE
// Primitive constructor to draw a (pie-chart) wedge
function makeWedge(context, centre, startAngle, internalAngle, clockWise, radius,
	fFlag, fCMYK, sFlag, sWidth, sCMYK,
	wLEnd, wLMiter, wMiterLimit,
	wName, wNote, wDash)
// Args:	group/layer in which wedge is created
//		centre coords (2-element array)
//		initial angle of rotation (degrees)
//		internal angle (degrees)
//		true to draw clockwise
//		CORE radius (REVAMP)
//		fill flag / cmyk
//		stroke flag / width / cmyk
//		line end / miter / miterlimit
//		name, note, dash

{
	var wedge;		// the wedge object
	var ppt;			// individual pathPoint...
	var pptOrigin;	// ...and its anchor (2-element array)
	var segmentAngle	// internal angle in radians
	var dpR			// right direction point of any point
	var dp90Rad		// direction points radius

	// During development:
	clockWise = !clockWise

	// Temp overwrites
	fFlag = false;
	sFlag = true;


	// listArgs(arguments)

	// REVAMP switches fill and stroke:
	fFlag = false;
	sFlag = true;
	sCMYK = fCMYK;
	fCMYK = '0|0|0|0';

	try {
		// segmentAngle = (2 * Math.PI) * (internalAngle / 360);
		segmentAngle = internalAngle * (Math.PI / 180)
		startAngle = startAngle * (Math.PI / 180)

		// Fix radius of the imaginary circle on which direction points will lie
		// for 90 degree wedge segments
		dp90Rad = Math.tan(c_halfPI / c_dpConst) * radius;
		dp90Rad = Math.sqrt(Math.pow(dp90Rad,2) + Math.pow(radius,2));

		// Create the object with arbitrary attributes...
		wedge = context.pathItems.add();
		wedge.stroked = true;	// ...to be going on with

		// *** REVAMP: no internal point, so comm'd out
		/*
		// First point is at internal end of start end of wedge
		ppt = wedge.pathPoints.add();
		ppt.anchor = centre;
		ppt.pointType = PointType.CORNER;
		ppt.leftDirection = centre;
		ppt.rightDirection = centre;
		*/

		// The rim of the wedge is created as:
		//		1)	a series of between zero and three 90-degree arcs
		//		2)	a final arc of less than 90 degrees

		// First rim point
		ppt = wedge.pathPoints.add();
		ppt.pointType = PointType.CORNER;
		pptOrigin = calcPoint(centre, radius, startAngle, clockWise);
		ppt.anchor = pptOrigin;
		// Direction points set to origin; right dp changes later...
		ppt.leftDirection = pptOrigin;
		ppt.rightDirection = pptOrigin;

		// Loop by wedge rim segments (if internal angle > 90-degrees)
		while (segmentAngle > c_halfPI) {
			// Var "ppt" still points to the last-created pathPoint
			// On the first loop, this is the first rim corner, created
			// before we entered the loop.
			// On subsequent loops, it refers to the pathPoint created
			// by the previous iteration
			// In either case, set right (exit) direction point of previous
			// pathPoint to 90-degrees
			dpR = calcRightDP(centre, dp90Rad, startAngle, c_halfPI, clockWise);
			ppt.rightDirection = dpR;
			// Draw a new point, at 90-degree rotation
			pptOrigin = calcPoint(centre, radius, startAngle + c_halfPI, clockWise);
			// Var "ppt" is reassigned to this new point
			ppt = wedge.pathPoints.add();
			ppt.anchor = pptOrigin;
			ppt.pointType = PointType.CORNER;
			// Set left (incoming) dp to 90-degrees
			ppt.leftDirection  = calcLeftDP(centre, dp90Rad, startAngle + c_halfPI, c_halfPI, clockWise)
			// Set right dp to origin
			// This is either:
			//	- set to 90-degrees by next loop; or
			//	- set to rotation of last segment after we exit the loop
			ppt.rightDirection  = pptOrigin
			//
			// De/increment --
			segmentAngle -= c_halfPI;
			startAngle += c_halfPI;
		}
		// Rim-segment loop ends

		// Whether we've looped or not, we can look back at a previous point which is either:
		//	a)	the first rim point; or
		//	b)	the last 90-degree point created inside the loop
		// In either case, that previous point -- still assoc'd with the var "ppt" --
		// has its right (exit) dp set to its origin.
		// I now redefine that right dp to match "segmentAngle", which represents either:
		//	a)	the complete angle for a segment < 90-degrees; or
		//	b)	the final segment of a rim > 90-degrees for which one or more 90-degree segments
		//		have already been drawn
		//

		// Calculate dp radius for this segment of < 90-degrees
		var dpRad = Math.tan(segmentAngle / c_dpConst) * radius;
		dpRad = Math.sqrt(Math.pow(dpRad,2) + Math.pow(radius,2));
		dpR = calcRightDP(centre, dpRad, startAngle, segmentAngle, clockWise);
		// Set right dp for previous point
		ppt.rightDirection = dpR;

		// Final rim point -- a segment of less than 90-degrees which is either:
		//	- appended to 1 or more 90-degrees segments, or
		//	- is the only segment of the rim
		//  Accumulate angle of rotation to complete wedge angle
		startAngle += segmentAngle;
		// Draw point
		ppt = wedge.pathPoints.add();

		pptOrigin = calcPoint(centre, radius, startAngle, clockWise);
		ppt.anchor = pptOrigin;
		ppt.pointType = PointType.CORNER;
		// Direction points
		// Left dp matches angle of this only/final segment
		ppt.leftDirection  = calcLeftDP(centre, dpRad, startAngle, segmentAngle, clockWise);
		// Right dp sits on origin
		ppt.rightDirection = pptOrigin;

		// Don't lose wedge
		wedge.closed = false;  // was 'true'

		// Sub-function sets other attributes
		if (!setPathAttributes(wedge, fFlag, fCMYK, sFlag, sWidth, sCMYK,
			wLEnd, wLMiter, wMiterLimit, wName, wNote, wDash)) {
			if (!g_primitiveError) {
				setAttributeError(wNote);
				g_primitiveError = true;
			}
		}
	}
	catch (err) {
		if (!g_primitiveError) {
			myAlert("This error occurred when " + c_I + " tried to draw item " + wName + " (from makeWedge)", err);
			g_primitiveError = true;
		}

	}
	return wedge;
}
// MAKE WEDGE ends


// LINE function
// Args are 	layer/group, points array (a series of x/y pairs),
//				fill flag, fill colour array (c,m,y,k),
//				stroke flag, stroke width, stroke colour array (c,m,y,k),
//				butt end (0,1,2) miter, miter limit (1 - ...),
//				object name; object note string
//				dash pattern array
//	Can deal with lines longer than setEntirePath's 1000-pt limit

function makeLine(context,linePath,fFlag,fCols,sFlag,sWidth,sCols,sEnd,sMiter,sMiterLimit,sName,sNote,sDash)
{
	// listArgs(arguments)
	var maxPoints = 1000;
	var pathRef;
	var myPts;
	var itemFlag = true;
	try {
		// How many points in the path?
		if (linePath.length > maxPoints) {
			// If more than the 1000 points that setEntirePath can handle,
			// extract first 1000 points and draw them in one fell swoop
			myPts = linePath.slice(0, maxPoints);
			pathRef = context.pathItems.add();
			pathRef.setEntirePath(myPts);
			// Then, beyond the 1000-pt limit, add points one-by-one!
			for (var i = maxPoints; i < linePath.length; i ++) {
				var newPoint = pathRef.pathPoints.add();
				newPoint.anchor = linePath[i];
				newPoint.leftDirection = newPoint.anchor;
				newPoint.rightDirection = newPoint.anchor;
				newPoint.pointType = PointType.CORNER;
			}
		}
		else {
			// Less than 1000 points: draw entire path
			pathRef = context.pathItems.add();
			pathRef.setEntirePath(linePath);
		}

		// Sub-function sets other attributes (fill, stroke, ID)
		if (!setPathAttributes(pathRef,fFlag,fCols,sFlag,sWidth,sCols,sEnd,sMiter,sMiterLimit,sName,sNote,sDash)) {
			if (!g_primitiveError) {
				setAttributeError(sNote);
				g_primitiveError = true;
			}
			s = "Unknown error"
			itemFlag = false;
		}
	}
	catch (err) {
		var s = err
		itemFlag = false;
	}
	if (!itemFlag) {
		if (!g_primitiveError) {
			myAlert(s + "\nThis error occurred when " + c_I + " tried to draw item " + sName + " (from makeLine)", s);
			g_primitiveError = true;
		}
	}
	return pathRef;
}
// Line ends



// MAKE TEXT
// 15 args: 	context (doc,layer/group) reference;
//		points array (across, up; or top, left, width, height); fill colour array (c,m,y,k),
//		font name, font size, leading,
//		alignment (1=left,2=centre,3=right), rotation, (kerning removed), horizontal scaling,
//		width for wrapping; boolean whether wrapped text moves up;
//		string, item name; item note string; tabular flag
// Assumed: there is a fill but no stroke
// Returns true if no error
function makeText(docRef,tOrigin,tCols,fName,fSize,fLeading,
	tAlign,tRotate,tHScale,tWrap,isWrapMove,tString,tName,tNote,isTabular)
{
	//listArgs(arguments) //displays all arguments passed to function

	if (isTabular === undefined) {
		isTabular = false;
	}

	try {
		// Origin:
		// For shapes, AI uses the co-ords up,across,width,height
		// But for point text, it uses across, up!
		// For consistency, positional co-ords are handled elsewhere in code as up,across --
		// I reverse them now:
		// (Values have to be passed on to another array to prevent the reversal being referred back...)
		var mtOrigin = new Array(tOrigin[1],tOrigin[0]);
		// Font:

		// Look up font name in application fonts list
		try {
			var myF = app.textFonts[fName];
		}
		catch (err) {};

		if (myF == undefined) {
			// Supplied font string not matched; use first available as default
			// and note substitution (up to 10 instances)
			myF = app.textFonts[0];
			if (g_fontSubstitutions.length < 10) {
				g_fontSubstitutions.push(tName + ": font " + fName + " not installed -- \n" + c_msgIndent +
				"substituted font " + myF.name);
			}
			else if (g_fontSubstitutions.length == 10) {
				g_fontSubstitutions.push(c_fontSubString)
			}
		}

		// Set color values for the CMYK object
		myCol = makeColourObject(tCols);

		// Point text at point of origin (2 co-ords: across + up)
		var myText = docRef.textFrames.pointText(mtOrigin);
		// Dummy contents so that I can set other attributes
		myText.contents = "a";

		with (myText) {
			name = tName;
			note = tNote;
			rotate(tRotate,true,false,false,false,Transformation.BOTTOM);

			// Justification -- 0=left, 1=centre, 2=right
			switch (tAlign) {
				case c_lConst :
					paragraphs[0].paragraphAttributes.justification=Justification.LEFT;
					break;
				case c_cConst :
					paragraphs[0].paragraphAttributes.justification=Justification.CENTER;
					break;
				case c_rConst :
					paragraphs[0].paragraphAttributes.justification=Justification.RIGHT;
					break;
				default :
					paragraphs[0].paragraphAttributes.justification=Justification.LEFT;
			}

			// Embedding following in a WITH{} causes Illustrator runtime error, so:
			textRange.characterAttributes.fillColor = myCol;
			textRange.characterAttributes.textFont = myF;
			textRange.characterAttributes.size=fSize;
			textRange.characterAttributes.autoLeading=false;
			textRange.characterAttributes.leading=fLeading;
			textRange.characterAttributes.horizontalScale=tHScale;
			// Overprinting only uses setting if black > 50%
			// (slightly inferential mod to juggle white text in corner boxes)
			if (myCol.black > 50) {
				textRange.characterAttributes.overprintFill=g_overprintText;
			}  else {
				textRange.characterAttributes.overprintFill == false;
			}

			// OpenType tabular or proportional
			if (isTabular) {
				textRange.characterAttributes.figureStyle = FigureStyleType.TABULAR;
			} else {
				textRange.characterAttributes.figureStyle = FigureStyleType.PROPORTIONAL;
			}

			// Kludge, Jan 2018, for +5 tracking on title string
			if (tName == "Title") {
				textRange.characterAttributes.tracking = 5;
			}

		}

		if (!wrapText(tString, myText, tWrap, tHScale, isWrapMove)) {
			myAlert(c_I + " failed to wrap text string:\n\"" + tString + "\"\nPlease adjust manually", "Non-fatal error")
		}

		// Compensate for any disparity between
		// origin and actual text left/right
		// (This seems a little late in the day; but I need actual contents (first/last char, anyway),
		// font, fontsize, etc...
		// 3rd param: Espresso charts have no margin, so we don't want to make this adjustment, 
		// which can cause string anchors to project...
		fineTuneOrigin(myText, tAlign, g_fineTuneStringOrigins);

		// Site-specific tweaks to text range content
		// (Eco italicises "The Economist")
		// Function is in site-specific module; does nothing at FT (so far...)
		// (Try/catch in case I forget to create FT version)
		try {doTextTweaks(myText)}
		catch (err) {
			if (!g_primitiveError) {
				alert("Error in function doTextTweaks()\nPlease advise Donald Hounam that this was reported...")
				g_primitiveError = true;
			}
		};
	}


	catch (err) {
		if (!g_primitiveError) {
			myAlert("This error occurred when " + c_I + " tried to draw the string \"" + tString + "\" (from makeText)", err)
			g_primitiveError = true;
		}
		// listArgs(arguments)
	}
	return myText;
}
// MAKE TEXT ends


/* --------------------------------------------
   --------------------------------------------
   ----- Second-level primitive functions ----- */


// SET PATH ATTRIBUTES function
// This is called by all path-creating functions: RECTANGLE, CIRCLE, WEDGE, LINE (not text)
// Sets fill and stroke attributes; name and note-string
// Does nothing about orientation...
function setPathAttributes(theObject,fFlag,fCols,sFlag,sWidth,sCols,sEnd,sMiter,sMLimit,oName,oNote,pDash,isHidden)
// Args: object; fill Flag, CMYK,
//		stroke flag, width, CMYK, line ends, miterjoin, miterlimit;
//		object name, note;
//		line dash, joins
{
	var dashA;
	//listArgs(arguments)
	try {
		// Fill
		theObject.filled=fFlag;
		theObject.name=oName;
		// Overprint? I've thrown a kludgy flag at the note properties
		// of bar and column rects. It looks as though Illy has started to
		// overprint elements by default; so this forces overprinting off
		// for bars and columns, where I've appended 'overprint-off' to
		// the note property
		// If this breaks, comment out next 2 lines and line 544
		var overPrint = oNote.search('overprint-off') < 0;
		oNote.replace('overprint-off', '');
		theObject.note=oNote;
		if (fFlag) {
			myCol = makeColourObject(fCols);
			theObject.fillColor = myCol;
			// theObject.fillOverprint = overPrint;
			// Nope: apparently we ALWAYS turn overprinting off
			theObject.fillOverprint = false;
		}
		// Stroke
		theObject.stroked = sFlag;
		// Hidden?
		if (isHidden === undefined) {
			isHidden = false;
		}
		theObject.hidden = isHidden;
		if (sFlag) {
			with (theObject) {

				strokeWidth=sWidth;				// width
				myCol = makeColourObject(sCols);

				strokeColor = myCol;

				if (sEnd == 2) {								// line end
					strokeCap = StrokeCap.ROUNDENDCAP;
				}
				else if (sEnd == 1) {
					strokeCap = StrokeCap.PROJECTINGENDCAP;
				}
				else {
					strokeCap = StrokeCap.BUTTENDCAP;
				}

				if (sMiter == 2) {							// join
					strokeJoin = StrokeJoin.ROUNDENDJOIN;
				}
				else if (sMiter == 1) {
					strokeJoin = StrokeJoin.BEVELENDJOIN;
				}
				else {
					strokeJoin = StrokeJoin.MITERENDJOIN;
				}
				strokeMiterLimit=sMLimit;						// miter limit

				// Dash. Documentation says that the strokeDashes property requires
				// an object; but this raises an error. So I just create an array
				//
				// If no dash, rather than an empty object, {}, as documented, create an empty array
				if ((pDash == undefined) || (pDash[0] == 0)) {
					dashA = Array();
				}
				else {
					// Array of values: dash & gap
					dashA = Array(pDash.length);
					for (i = 0; i < dashA.length; i ++) {
						dashA[i] = pDash[i];
					}
				}

				// Kludgy mod Jan 2018 to overprint lines, if unfilled and black
				if (!fFlag) {
					if (sCols[3] > 90) {						
						strokeOverprint = g_overprintStroke;
					} else {
						strokeOverprint = false;
					}
				}

				try {
					strokeDashes = dashA;
				}
				catch (err) {};
			}
		}
		// If we've got here:
		return true;
	}
	catch (err) {
		// listArgs(arguments)
		return false;
	}
}
// End SET PATH ATTRIBUTES

// SET ATTRIBUTE ERROR Function reports errors setting item attributes
// Called from rectangle, ellipse, circle, etc.
//
function setAttributeError (theItem)
{
	msg = "An error occurred setting the attributes of this item. " +
	"It may not have been drawn correctly...";
	myAlert (msg, theItem);
}
// End SET ATTRIBUTE ERROR

// ITEM ERROR function reports errors drawing items
// Called from whatever code called rectangle, ellipse, circle, etc.
//
function itemError (theItem)
{
	msg = "An error occurred drawing this item; it may not have been drawn correctly...";
	myAlert (msg, theItem);
}
// End ITEM ERROR


// WRAP TEXT function inserts string into text object and wraps it as necessary
// Params are string, text object, wrap width, default horizontal scale (set by preferences); true if text moves up on wrap
function wrapText (wString, wText, allowedWidth, currentHS, wMove)
{
	// Zero signals no wrap; insert contents in passed page item and bale out
	if (wString == undefined) {return true};
	if (allowedWidth == 0) {
		wText.contents = wString;
		return true;
	}
	try {
		// Separate string into array of words
		var pattern = RegExp(" ");
		wString = wString.split(pattern);
		// String-holders --
		var thisWord;
		var thisStr = "";
		var lastStr = "";
		// Empty the range (again!)
		wText.contents = "";
		var i=0;	// Counter
				// Loop by each word in wString
		for (i = 0; i < wString.length; i ++) {
			lastStr = thisStr;				// reserve string from last loop
			thisWord = wString[i];			// get next word
			if (i>0) {
				thisWord = " " + thisWord;		// precede with a space (after first loop)
			}

			thisStr += thisWord;				// add next word to current string
			wText.contents = thisStr;			// set range contents to current string

			// Is the range too wide?
			if (wText.width > allowedWidth) {

				// By default, flag forces reversion to previous line
				var isSqueezed = false;

				// Originally I tested for squeezing on every line
				// As of May 06, only test final word

				// If this is the last word and we're over-length, try to squeeze...
				if (i == (wString.length - 1)) {

					// Squeeze down; lower limit is a GP
					for (var x = currentHS; x > (g_wrapSqueeze - 1); --x) {
						wText.textRange.characterAttributes.horizontalScale = x;
						// If the text squeezes into the width, reserve scaling and break
						if (wText.width <= allowedWidth) {
							isSqueezed = true;
							currentHS = x;
							break;
						}
					}
				}

				// If the text was successfully squeezed, just start new line
				if (isSqueezed) {
					wText.characters.add("\r");
				}
				// Text wouldn't squeeze to fit
				else {
					// Revert to previous scaling
					wText.textRange.characterAttributes.horizontalScale = currentHS;
					wText.contents = lastStr;			// revert to string from previous loop
					wText.characters.add("\r");			// new line
					wText.characters.add(thisWord.slice(1));	// append current word (less preceding space)
					thisStr = wText.contents;			// reserve wrapped string for next loop
				}
				//
			} 	// end of fork on whether string too wide

		}
		// If text wrapped, does it have to move up?
		if (wMove) {
			var x = wText.textRange.lines.length
			if (x > 1) {
				var myMove = (x-1) * (wText.textRange.characterAttributes.leading)
				wText.top += myMove
			}
		}
		return true;
	} 	//end try
		// if any surprises return false
	catch (err) {
		return false;
	}
}
// End WRAP TEXT

// FINE TUNE ORIGIN
// Called from makeText
// When point text is drawn, there can be a gap between the anchor
// and the actual left/right of the text object
// So this creates an outline, gets that disparity, and tweaks the
// range object so that its actual left/right is "on" the horizontal
// anchor point...
function fineTuneOrigin(ftoRange, alignment, fineTune)
// Args are: text range; alignment; and the flag that dictates whether 
// text should align by origin (false), or be tweaked to visual edge of 
// first/last char (true). Currently this is true for Espresso charts.
{
	var leftDisparity = 0;
	var rightDisparity = 0;
	var leftOutlineProjects = false;
	var rightOutlineProjects = false;
	// Create outline
	var o = makeOutline(ftoRange, true);

	// I need to know the disparity first...
	if (alignment == c_lConst) {
		leftDisparity = o.left - ftoRange.anchor[0];
		if (leftDisparity > 0) {
			leftOutlineProjects = true;
		}
	}
	else if (alignment == c_rConst) {
		rightDisparity = ftoRange.anchor[0] - (o.left + o.width);
		if (rightDisparity > 0) {
			rightOutlineProjects = true;
		}
	}
	
	// KLUDGE ALERT!
	// I'm sure there's a better way of doing this, but I've got two men
	// drilling holes in the wall and life is short...
	var dropOut = !fineTune;
	// I don't know if this is going to work... but we have an outlier where
	// in a y-axis, if the label is "1" or "-1" it just looks... weird. So...
	if ((ftoRange.contents == "1") || (ftoRange.contents == "-1")) {
		dropOut = true;
	}
	// But there's another outlier! In charts that have no margin, we don't,
	// by default, do this 'fine-tune'. HOWEVER, sometimes when the anchor
	// is on the edge, the character projects (e.g. u/c "J"). So...
	if (!fineTune) {
		if (leftOutlineProjects || rightOutlineProjects) {
			dropout = false;
		}
	}

	// Delete outline object
	o.remove();
	
	if (dropOut) {
		return;
	}

	if (alignment == c_lConst) {
		// Left
		// oDisparity = o.left - ftoRange.anchor[0];
		// if (oDisparity > 0) {
		ftoRange.left -= leftDisparity;
		// }
	}
	else if (alignment == c_rConst) {
		// Right
		// oDisparity = ftoRange.anchor[0] - (o.left + o.width);
		ftoRange.left += rightDisparity;
	}
	// Centred does nothing...
}
// FINE TUNE ORIGIN ends
