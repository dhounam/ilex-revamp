﻿/*

This file contains ECONOMIST-SPECIFIC declarations & functions

	__________________________________________________________________________________________________
	This version is coded for yyyymmdd_IDCnnn.eps (date + underscore + section + "C" + number + ".eps"
	__________________________________________________________________________________________________

*** April 2013
*** Drop all 'complex' saves: files are saved to ~Desktop/_Ilex/
*** There are no print or png options...
*** And no provision for "Save to CCI"

Latest mod 25.6.13 uses original name for multipanels

Functions below:

- isOngoingChart
	verifies (from file name) that active doc is an ongoing Economist chart
	called from Start_up/setUpDocument
- startFromScratchQueryMsg
	site-specific message about ignoring active document and starting chart from scratch
	called from Panels.matchSlot

- Broken scale:
- 	drawBrokenScale1
		draws broken scale baseline and symbol(s) to Economist style
		called from VScales.breakScale
- 	drawBSZero
		draws optional zero for broken scale
- 	drawBrokenScale2
		does nothing at Economist (FT uses it to append BS symbol to h-scale tick
		called from Main.Ilex

- steplineFilter
	tweaks stepline traces to Economist style
	called from Lines.drawLine

- drawChartNumber
	draws corner number box
	called from Main

- drawBoxes
	draws details boxes
	called from Main.Ilex

- translateString
	converts problematic chars in strings (conversion lists in General Prefs)

- Save
- 	getScratchName
		works out site-specific name for a chart file
		called from Main.Ilex
+ SAVE CCI : 4 functions:
- 	saveToCCI
		main function, called from visible stub in "Save CCI.jsx"
- 	getCCIPath
		works out path to CCI drop-in folder
- 	printDoc
- 	saveFile

- XMP functions:
-	setXMP
-	getXMPProperties

*/

// $.level=1;

// Constant exists mainly to work round the fact that, in StartUp, I have to check all paths
// before I've read in GPs file...
// const c_CCI = true;
g_CCI = true;

// Some internal globals, used working out CCI options
var local_oneDay = 1000 * 60 * 60 * 24;	// One day
var local_oneWeek = local_oneDay * 7;	  // One week
var local_dateStrChosen;				// Issue date chosen in CCI dialog, as string...
var local_dateObjChosen;				// ...and as date object
var local_desktopOption = false;		  // Desktop-save option chosen in CCI dialog
var local_pngOption = false;			  // png option chosen in CCI dialog
var local_printOption = false;			// Print option chosen in CCI dialog
var local_closeOption = false;			// Close file? option chosen in CCI dialog
//var local_cciResult = false;			// Result returned by CCI dialog (if true, save to CCI)
//var local_ecoStr = "";				 // Date-string element of file name (a string in "yyyymmdd" format)


/// IS ONGOING CHART
// Function checks whether name of document is consistent with an ongoing chart
// Economist skeleton changed, July 2010, to yyyymmddIDCnnn.eps
//		yyyy   = year
//		mm  = month
//		dd = day
//		ID = sectionID
//		C = literal
//		nnn = 3 digits
// If it matches, does a secondary check on layers to exclude maps...
function isOngoingChart(aDoc)
// Arg is active document as object
{
	var docName = aDoc.name;
	var s;
	var sectionList;
	var bLayer;
	var x;

	// I don't want to be bothered with file extension, so delete
	pattern = RegExp("\\" + c_extSep)
	x = docName.search(pattern)
	if (x > 0) {docName = docName.slice(0,x)};

	// Name should start with eight numbers (YYYYmmDD)
	s = docName.slice(0,8);
	if (isNaN(s)) {
		return false;
	}

	// Char 9 should be an underscore
	if (docName.slice(8,9) != c_underscore) {
		return false;
	}

	// Chars 10-11 are sectionID
	// Get sectionID list as string
	sectionList = g_sectionList.join() + ",XX"
	// ("XX" allows my tests to go through)
	if (sectionList) {
		s = RegExp(docName.slice(9,11));
		if (sectionList.search(s) < 0 ) {
			// No section match...
			return false;
		}
	}
	else {
		// Error would have occurred processing sectionID names
		return false;
	}

	// Still here? Section matches
	// Char 9 should be chart identifier
	if (docName.slice(11,12) != c_chartPrefix) {
		return false;
	}

	// Three numbers complete skeleton
	s = docName.slice(12, 15);
	if (isNaN(s)) {
		return false;
	}

	// Still here?
	// File name is CCI-compatible.
	// But is there a Background Layer (to exclude maps)?
	try {
		bLayer = aDoc.layers[c_backLayerN];
	}
	catch (err) {};
	if (bLayer == undefined) {
		return false;
	}
	else {
		return true;
	}
}
// End ONGOING CHART

// START FROM SCRATCH QUERY MSG
// Called from Panels.matchSlot
// Returns site-specific message
function startFromScratchQueryMsg(docName)
{
	return "Help me out here\nThe active document's name is compatible with " +
		"a chart; however it lacks the correct structure.\n" +
		"If you click \"Yes\" I'll put this window aside and start the chart from scratch. " +
		"If you say no, I'll do nothing.\n\n" +
		"Ok to continue...?"

}
// START FROM SCRATCH QUERY MSG ends

// TWEAK THERMO TICKS
// Called from Main > Ilex if we're drawing a thermometer chart
// Param is boolean cols/bars.
function tweakThermoTicks(isColumns) {
	var pc, sc;
	// The assumption is that there's a global, g_thermoRawPointArray,
	// created in either:
	// Columns > drawThermoColTrace (approx line 116)
	// Bars... to come

	// If not REVAMP, drop out:
	if (!g_isRevamp) {return;}

	// Count series and points in my thermo min/max array
	var seriesCount = g_thermoRawPointArray.length;
	// No reason to proceed if less than 2 series:
	if (seriesCount < 2) {return;}
	// I think this point-count sanity check is unnecessary --
	// if we've got this far, the data must be consistent... I think...
	// var tempArray = [];
	// for (var iii = 0; i < seriesCount; i ++) {
	// 	tempArray.push(g_thermoRawPointArray[iii].length);
	// }
	// var pointCount = Math.max.apply(Math, tempArray);
	var pointCount = g_thermoRawPointArray[0].length;

	// What I want, in the end, is an array of pointsCount objects,
	// each with min and max properties.
	// Code I can use is: Math.min.apply(Math, [100,13,3,6]);
	//
	var minMaxArray = [];
	var tempArray;
	for (pc = 0; pc < pointCount; pc ++) {
		// Loop by points, extracting a val from each series
		tempArray = [];
		for (var sc = 0; sc < seriesCount; sc++) {
			tempArray.push(g_thermoRawPointArray[sc][pc]);
		}
		// So tempArray is an array of seriesCount values.
		// Pack min and max into an object and append it to the array:
		var o = {};
		o.min = Math.min.apply(Math, tempArray);
		o.max = Math.max.apply(Math, tempArray);
		minMaxArray.push(o);
		// alert(minMaxArray[pc].min + " / " + minMaxArray[pc].max);
	}
	// minMaxArray is an array of pointsCount length, each element of which
	// is an object with min/max props representing x or y coords
	// on the page...

	var d = activeDocument;
	var pArray;

	// Fix x or y val of anchor?
	var pIndex = 0;
	if (isColumns) {
		pIndex = 1;
	}

	// Columns: loop by points...
	for (var i = 0; i < minMaxArray.length; i ++) {
		// Identify the line...
		var tLine = d.pathItems[c_thermoFront + (i + 1)];
		// Min: extract and change anchor
		var pp = tLine.pathPoints[1];
		pArray = pp.anchor;
		pArray[pIndex] = minMaxArray[i].min;
		pp.anchor = pArray;
		// Knock any bezier tendency on the head:
		pp.leftDirection = pArray;
		pp.rightDirection = pArray;
		pp.pointType = PointType.CORNER;
		// Max:
		pp = tLine.pathPoints[0];
		pArray = pp.anchor;
		pArray[pIndex] = minMaxArray[i].max;
		pp.anchor = pArray;
		pp.leftDirection = pArray;
		pp.rightDirection = pArray;
		pp.pointType = PointType.CORNER;
	}

}

// DRAW BROKEN SCALE 1
// Called from VScales.drawVScales
// Draws baseline and symbol to Economist style
function drawBrokenScale1()
{
	var vPos;
	var hStart;		// baseline start/end
	var hEnd;
	var tPoints;		// coord holder
	var sW;			// width
	var sCol;		// colour
	var temp;
	var sXLeft;		// symbol coords
	var sXRight;
	var sY;
	var sideFlags = Array(true,true);
	var baseFlag = true;
	var bs;
	var drawSymbolLeft;	// local left/right flag because of scatter anomaly
	var drawSymbolRight;	// (see about 5 lines below)

	// If this is a scatter chart and vertical scale doesn't break,
	// bale out now:
	if ((g_overallStyle[0] == c_generalScatterConst) || (g_overallStyle[1] == c_generalScatterConst)) {
		if(!g_isBS[1]) {return true};
		// While we're in a scatter condition, define left/right flags
		// (Whether they're still undefined will be tested below)
		drawSymbolLeft = g_scatterScaleLeft;
		drawSymbolRight = !g_scatterScaleLeft;
	}
	else {
		// Not a scatter.
		// MOD NOV 20: previously these 2 vars were defined 70 lines down (comm'd out);
		// but that was no good because they need values before that! So trying here...
		drawSymbolLeft = g_isBS[0];
		drawSymbolRight = g_isBS[1];
	}

	// If both sides relate to broken columns, I don't want any broken scale baseline/symbol
	if (g_overallStyle[0] == c_generalColConst) {
		sideFlags[0] = false;
	}
	if (g_overallStyle[1] == c_generalColConst) {
		sideFlags[1] = false;
	}
	if (!sideFlags[0] && !sideFlags[1]) {
		return true;
	}

	// Inverted scale(s)
	// If either scale is inverted, bale out...
	if (g_invertedScaleA || g_invertedScaleB) {
		return true;
	}

	// I have an array, g_isBS with 2 boolean elements:
	//		0 = left
	//		1 = right

	// Baseline location across current inner box width, less margin at left or right
	// Vertical coord
	vPos = (g_innerBox.top - g_innerBox.height) - g_brokenScaleMargin;
	// Default h-coords
	hStart = g_innerBox.left;
	hEnd = g_innerBox.left + g_innerBox.width;

	// "No baseline" flag
	if (g_doubleScale > 0) {
		// Double scale requires both sides to be broken columns
		if (g_isBS[0] && (g_overallStyle[0] == c_generalColConst) &&
		g_isBS[1] && (g_overallStyle[1] == c_generalColConst)) {baseFlag = false};
	}
	else {
		// Non-double scale requires either side to be broken column
		if (g_isBS[0] && (g_overallStyle[0] == c_generalColConst)) {baseFlag = false};
		if (g_isBS[1] && (g_overallStyle[1] == c_generalColConst)) {baseFlag = false};
	}

	// Positions -- drawSymbolLeft/Right must be defined by now...
	if (drawSymbolLeft) {
		// was (g_isBS[0])
		hStart += g_inTickMargin;
	}
	if (drawSymbolRight) {
		// Revamp sticks to external margin
		if (!g_isRevamp) {
			hEnd -= g_inTickMargin;
		}
	}

	// Baseline
	if (baseFlag) {
		tPoints = new Array(Array(hStart,vPos),Array(hEnd,vPos));
		sW = g_vScaleBaseStrokeWidth;
		sCol = g_vScaleBaseCMYK;
		g_baselineTick = makeLine(g_panelLayer, tPoints, false, undefined, true, sW, sCol, c_defaultLineEnd,
			c_defaultLineMiter, c_defaultLineMiterLimit, c_baselineN, c_baselineN);
	}
	// The problem here is that I'm drawing the baseline to the inner box, which
	// is currently set to inner edges of vscale labels... when I want to draw to
	// an eventual inner box...

	// Symbol(s) -- basic positions
	// But these get overwritten below in some cases (specifically, Print / right)
	sXLeft = hStart - (g_inTickMargin + g_outTickMargin + 4);
	if (g_isRevamp) {
		sXRight = hEnd;
	} else {
		sXRight = hEnd + g_inTickMargin + g_outTickMargin;
        sXRight += 20;
	}

	// Size is determined by GP g_brokenScaleSymbolHeight
	// Symbol is drawn within a box
	// Set % along sides where symbol touches box sides:
	bs = (g_brokenScaleSymbolHeight * 0.35);

	// Revamp: adjust vPos for symbol to go halfway between baseline and first v-tick:
	if (g_isRevamp) {
			vPos += g_brokenScaleMargin / 2;
	}

	// Left: only drawn if left breaks...
	if (drawSymbolLeft) {
		// ... and is not columns
		if (sideFlags[0]) {
			// Revamp: use actual tick ends
			if (g_isRevamp) {
				sXLeft = g_vScaleTickGroup.left;
			}
			// Double scale special colour?
			if (g_doubleScale > 0) {sCol = g_doubleScaleLeftTextCMYK};

			if (g_isRevamp) {
				// Revamp style
				tPoints = [];
				tPoints.push([sXLeft, vPos]);
				tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 4 ), vPos]);
				// Mod Jan 17: prev'y I 'mirrored' BS symbols on doublescales. But apparently Matt wants them the same, so...
				// tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 8 * 3 ), vPos - (g_brokenScaleSymbolHeight / 2)]);
				// tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 8 * 5 ), vPos + (g_brokenScaleSymbolHeight / 2)]);
				tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 8 * 3 ), vPos + (g_brokenScaleSymbolHeight / 2)]);
				tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 8 * 5 ), vPos - (g_brokenScaleSymbolHeight / 2)]);
				tPoints.push([sXLeft + ( g_brokenScaleSymbolWidth / 8 * 6 ), vPos]);
				tPoints.push([sXLeft + g_brokenScaleSymbolWidth, vPos]);
				// Draw:
				temp = makeLine(g_panelLayer, tPoints, false, undefined, true, sW, sCol, c_defaultLineEnd,
					2, c_defaultLineMiterLimit, c_bSymbolN, c_bSymbolN);
			}
			else {
				// Old style
				tPoints = new Array(
					Array(sXLeft, vPos + bs),
					Array(sXLeft + g_brokenScaleSymbolHeight - bs, vPos + g_brokenScaleSymbolHeight),
					Array(sXLeft + bs, vPos),
					Array(sXLeft + g_brokenScaleSymbolHeight, vPos +  + g_brokenScaleSymbolHeight - bs)
				)
				temp = makeLine(g_panelLayer, tPoints, false, undefined, true, sW, sCol, c_defaultLineEnd,
					c_defaultLineMiter, c_defaultLineMiterLimit, c_bSymbolN, c_bSymbolN);
			}
		}

		// Zero label?
		if (g_showZeroBroken) {
			drawBSZero(true, vPos)
		}
	}

	// Right: only drawn if it breaks and is not columns:
	if (drawSymbolRight) {
		if (sideFlags[1]) {
			// Use actual tick ends
			sXRight = g_vScaleTickGroup.left + g_vScaleTickGroup.width;
			// Double scale special colour?
			if (g_doubleScale > 0) {
				sCol = g_doubleScaleRightTextCMYK;
			} else {
				sCol = g_vScaleBaseCMYK;
			}

			if (g_isRevamp) {
				// Revamp style
				tPoints = [];
				tPoints.push([sXRight, vPos]);
				tPoints.push([ (sXRight - (g_brokenScaleSymbolWidth / 4)), vPos]);
				tPoints.push([ (sXRight - ( g_brokenScaleSymbolWidth / 8 * 3 )), (vPos - (g_brokenScaleSymbolHeight / 2) ) ]);
				tPoints.push([ (sXRight - ( g_brokenScaleSymbolWidth / 8 * 5 )), vPos + (g_brokenScaleSymbolHeight/ 2)]);
				tPoints.push([ (sXRight - ( g_brokenScaleSymbolWidth / 8 * 6 )), vPos]);
				tPoints.push([ (sXRight - g_brokenScaleSymbolWidth), vPos]);
				// Draw
				temp = makeLine(g_panelLayer, tPoints, false, undefined, true, sW, sCol, c_defaultLineEnd,
					2, c_defaultLineMiterLimit, c_bSymbolN, c_bSymbolN);
			}
			else {
				// Old style
				sXRight +=  g_outTickMargin;
				tPoints = new Array(
					Array(sXRight, vPos + bs),
					Array(sXRight + g_brokenScaleSymbolHeight - bs, vPos + g_brokenScaleSymbolHeight),
					Array(sXRight + bs, vPos),
					Array(sXRight + g_brokenScaleSymbolHeight, vPos +  + g_brokenScaleSymbolHeight - bs)
				)
				temp = makeLine(g_panelLayer, tPoints, false, undefined, true, sW, sCol, c_defaultLineEnd,
					c_defaultLineMiter, c_defaultLineMiterLimit, c_bSymbolN, c_bSymbolN);
			}
		}

		// Zero label?
		if (g_showZeroBroken) {
			drawBSZero(false, vPos)
		}
	}

	return true;
}
// DRAW BROKEN SCALE 1 ends

// DRAW BS ZERO
// Called from drawBrokenScale1 to draw zero on broken scale
function drawBSZero(atLeft, toBase)
// Args: 	true=left; false=right
//			baseline v-coord
{
	var sGrp;
	var newZero;
	var o;
	var zT;
	var zH;
	var zMove;

	try {
		if (atLeft) {
			sGrp = g_myDoc.groupItems[c_vScaleStringGroupN + c_lConst];
		}
		else {
			sGrp = g_myDoc.groupItems[c_vScaleStringGroupN + c_rConst];
		}

		newZero = sGrp.textFrames[0].duplicate();
		newZero.contents = "0";
		newZero.name = c_vScaleStringN + sGrp.textFrames.length;

		// Make and measure outline
		o = makeOutline(newZero,true);
		zT = o.top;
		zH = o.height;
		o.remove();

		if (g_vScaleLabelAlign > 0) {
			zMove = (zT - zH) - toBase - g_vScaleLabelAlign;
		}
		else if (g_vScaleLabelAlign < 0) {
			zMove = zT - toBase - g_vScaleLabelAlign;
		}
		else {
			zMove = (zT - toBase) - (zH / 2);
		}

		newZero.top -= zMove;
	}
	catch (err) {
		if (!(newZero == undefined)) {newZero.remove()};
		if (!(o == undefined)) {o.remove()};
		myAlert("Unable to draw zero on broken scale...","Sorry");
	}
}
// DRAW BS ZERO ends


// DRAW BROKEN SCALE 2
// Does nothing at Economist
function drawBrokenScale2()
{
	return true;
}
// DRAW BROKEN SCALE 2 ends


// STEPLINE FILTER
// Called from Lines.drawLine
// Submits stepline to site-specific style, which is inferentially
// defined here (i.e. nothing in preferences)
function steplineFilter(sfLine)
	// Arg is path to restyle
	{
	// REVAMP: sets miter to corner and miterlimit to 10
	if (g_isRevamp) {
		sfLine.strokeJoin = StrokeJoin.MITERENDJOIN;
		sfLine.strokeMiterLimit=10;
	}
	else {
		// Print: double-duplication of steplines
		// Create group
		var stepGroup = g_panelLayer.groupItems.add();
		stepGroup.name = c_stepGroupN;
		// Move path to group
		sfLine.move(stepGroup, ElementPlacement.PLACEATEND);
		// Change strokewidth; duplicate and move...
		sfLine.strokeWidth = 0.75
		var newLine = sfLine.duplicate()
		newLine.top += 0.7
		newLine = sfLine.duplicate()
		newLine.top -= 0.7
	}
}
// STEPLINE FILTER ends

// DRAW CHART NUMBER
// Called from Main to draw number-box on chart
function drawChartNumber()
{
	var bGrp;			// groups box and number
	var nBox;			// box object
	var boxW = 10;		// box width/depth
	var boxOffsetTop = 0;	   	// distance from top/right is a default...
	var boxOffsetRight = 0;		//...overwritten from lookup
	var boxCMYK;			// box colour
	var origin;							// text origin coords
	var toFill = Array(0,0,0,0);		// text fill colour
	var toFont = "EconSansBol";		 // text font
	var toSize = 7.5;						// font size
	var bTxt;							// text range object
	var tSize;							// text outline size object
	var s = "?";						// string
	var cmykArray = [0,0,0,0];

	/* There may be three globals:
		g_numberBoxCMYK
		g_numberBoxOffsetTop
		g_numberBoxOffsetRight
	...that can overwrite the default number box settings.
	These currently exist only for SR, BB and FB. If they extend to other styles
	they merely have to be added to the relevant lookup file...
	*/
	if (g_numberBoxCMYK !== undefined) {
		cmykArray = g_numberBoxCMYK;
		boxOffsetTop = g_numberBoxOffsetTop;
		boxOffsetRight = g_numberBoxOffsetRight;
		toFont = g_numberBoxFontName;
		toSize = g_numberBoxFontSize;
	}

	// If there is an existing number group, bale out now...
	if (numGroupExists()) {return};

	// Does user have a number in mind?
	msg = "Please enter the number to go in the corner box. " +
		"Or \"Cancel\" for no box at all..."
	s = prompt(msg,s,"Chart number");
	if (s == null) {return};
	s = s.replace(" ","","g");
	if (s == "") {s = "?"};

	// BOX
	// Duplicate background box in new group
	bGrp = g_backBox1.parent.groupItems.add();
	bGrp.name = "Number group";
	nBox = g_backBox1.duplicate();
	nBox.move(bGrp, ElementPlacement.PLACEATEND);
	nBox.name = "Number box";
	// Define box attributes
	boxCMYK = new CMYKColor();
		boxCMYK.cyan = cmykArray[0];
		boxCMYK.magenta = cmykArray[1];
		boxCMYK.yellow = cmykArray[2];
		boxCMYK.black = cmykArray[3];
	// Position box and set attributes
	nBox.top -= boxOffsetTop;
	nBox.left += nBox.width - (boxW + boxOffsetRight);
	nBox.width = boxW;
	nBox.height = boxW;
	nBox.filled = true;
	nBox.fillColor = boxCMYK;
	nBox.stroked = false;

	// TEXT STRING
	// Initial position
	origin = Array(
		nBox.top - (boxW / 2),
		nBox.left + (boxW / 2)
		);
	bTxt = makeText(bGrp, origin, toFill, toFont, toSize, toSize,
		c_cConst, 0, 100, 0, false, s, "Number text", "Number text", false);
	// Calculate distance to tweak for vertical centre
	var tSize = new getTFrameSize(s, toFont, toSize, 100, true, false);
	bTxt.top -= tSize.height / 2;

}
// DRAW CHART NUMBER ends

// NUM GROUP EXISTS
// Returns true if there is already a number group (subsequent panels)
// Called from drawChartNumber, immed'y above
function numGroupExists()
{
	try {
		var ng = g_myDoc.groupItems["Number group"]
		return true;
	}
	catch (err) {
		return false;
	}
}
// NUM GROUP EXISTS ends

// DO SITE-SPECIFIC SAVE
// Saves file after processing (from scratch or new panel); called from Main
// Site-specific mainly for terminology.
function doSiteSpecificSave()
{
	clearOutDropFolder(saveIlexFile);
	// ...that should callback saveIlexFile()...
	return true;
}
// DO SITE-SPECIFIC SAVE ends

//$.level=1;

// CLEAR OUT DROP FOLDER
// Called from siteSpecificSave to clear out drop folder
function clearOutDropFolder(callback) {
	var dFolder, fArray, f, myFile, now, diff, dStr;
	/*
	dFolder = new Folder(c_ilexSaveFolder);
	fArray = dFolder.getFiles();
	dStr = "I have deleted the following files, more than 10 days old, from your local dropfolder " + dFolder + ":"
	for (f in fArray) {
		myFile = fArray[f];
		if (!myFile.hidden) {
			created = myFile.created;	// or cd use myFile.modified
			//$.bp();
			now = new Date();
			diff = now.getTime() - created.getTime();
			diff = diff / (1000 * 60 * 60 * 24);
			if (diff > 10) {
				dStr += "\n" + myFile.name;
				myFile.remove();
				myAlert(dStr, "Housekeeping");
			}
		}
	}
	*/
	// Call saveIlexFile
	callback();
}
// CLEAR OUT DROP FOLDER

// CHARACTER TRANSLATION FUNCTIONS

// TRANSLATE STRING
// Called from Background.drawTitle / drawSubtitle / drawFootnote (not source)
// and from drawKeys
// Translates special characters in title, subtitle footnote and trace-label strings...
// SHOULD PROBABLY ALSO DO CATEGORY STRINGS IF NAMES
// AND I MAY NEED MORE SOPHISTICATED TESTING ON APOSTROPHES,
// MAYBE REQUIRING A SMARTQUOTES OPTION IN GPS...
// Modded Jan 08 to allow for an "escape" constant
function trans_String(inStr)
// Arg should be a string (see 4 lines below)
{
	var i;
	var newChar;
	var escapePattern;

	if (inStr === undefined) {return "";}

	// If argument is a number, force to string:
	if (!isNaN(inStr)) {inStr =  inStr.toString()}

	// I have two look-up arrays (from GPs): one of "source" characters;
	// the 2nd of "target" characters.

	// Loop through source list, element by element...
	// 	(so, for each translation pair...)
 	for (i = 0; i < g_sourceSymbols.length; i ++) {

 		// Reg expression of "source" char to replace, with "replace all" flag
 		pattern = RegExp(g_sourceSymbols[i],"g")

		// But source char may be preceded by "escape", so...
 		// Reg expression of escaped char to replace, with "replace all" flag
 		escapePattern = RegExp(c_escapeChar + g_sourceSymbols[i],"g")

 		// Substitute char
 		newChar = g_targetSymbols[i];
 		// If substitute char is a number, treat as unicode:
 		if (!isNaN(newChar)) {
 			newChar = String.fromCharCode(newChar);
 		}

 		// First, replace all instances of escaped symbol with substitute constant
 		inStr = inStr.replace(escapePattern, c_escapeSubstitute);

 		// Replace all instances of un-escaped "source" symbol with "target"
 		inStr = inStr.replace(pattern,newChar);

 		// Replace escape substitute with original symbol
 		pattern = RegExp(c_escapeSubstitute,"g")
 		inStr = inStr.replace(pattern,g_sourceSymbols[i]);

	}

	// Return translated string
	return inStr;
}
// TRANSLATE STRING ends




// _____________________________________________________________________
// 							SAVE ILEX FILE
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// SAVE ILEX FILE
// Called from doSiteSpecificSave (above, this module)
// Names file and saves it to temporary folder ~Desktop/Ilex/
// Should also do a clear out, non?
//
// Called from doSiteSpecificSave (above) at end of initial "Ilex" chart process
function saveIlexFile()
{
	var myDoc, currentDate, xmpProperties;
	// Verify local target folder
	if (!checkIlexTargetFolder()) {
		return false;
	}
	// Is there an open document? If not, we're all wasting our time...
	// (Checked after we're sure getPreliminaries has told us whether we've Mac or Windows)
	try {
		myDoc = activeDocument;
	}
	catch (err) {
		myAlert("I can't save a file unless there's one open for me to save...","Document error");
		return false;
	}

	// XMP properties
	xmpProperties = getXMPProperties(myDoc);

	// Get "this" week's issue date from system (as date obj)
	// Thurs noon cutoff
	// *** Hard-codes to this week. If we want a "future" option, it would have to be here...?
	currentDate = getNextSaturday(true);
	// So currentDate is current ("this week") issue date (in ms);

	// File name based on date and section
	// g_chartName = makeScratchName(currentDate);

	// New file works out its name...
	if (g_scratchFile) {
		// File name based on date and section
		g_chartName = makeScratchName(currentDate);
	}
	else {
		// Existing (panelled) file uses its own name
		g_chartName = myDoc.name;
	}

	// Print:
	// No: Jan 2017 -- printing cancelled
	// printDoc(myDoc, g_chartName, xmpProperties, currentDate)

	// Crop tight on artwork
	setTightCrop(myDoc);

	// Save file (finally!)
	try {
		// Local save:
		fN = c_ilexSaveFolder + g_chartName;
		// Ensure names has EPS extension
		if (fN.search(".eps") != (fN.length - 4)) {
			fN += ".eps";
		}
		// So fN is complete path and file name

		// Update details box strings to ACTUAL background box dimensions
		// ("Try" since details layer may no longer exist)
		try {
			var bb1 = myDoc.pathItems[c_backBoxN + "1"];
			var wRange = myDoc.textFrames["Details_string_2"];
			var hRange = myDoc.textFrames["Details_string_3"];
			wRange.contents = bb1.width;
			hRange.contents = bb1.height;
		}
		catch (err) {};


		// Delete Details layer if it exists...
		try {
			myDoc.layers[c_detailsLayerN].locked = false;
			myDoc.layers[c_detailsLayerN].remove();
		}
		catch (err) {};

		// Apply XMP properties to doc
		setXMP(myDoc, xmpProperties);

		// Save file
		if (!saveFile(myDoc, fN)) {
			myAlert(fN + "\nFile not saved. Please save by hand...","File save error");
			return false;
		}

	}
	catch (err) {
		myAlert("File not saved. Please save by hand and advise " + c_authorName + " that this error occurred...",
			"Unexpected error: " + err);
		return false;
	}
}
// SAVE ILEX FILE ends


// -------------
// CHECK ILEX TARGET FOLDER
// Called from saveIlexFile
// Verify that target "_Ilex" folder exists; if not, create...
function checkIlexTargetFolder()
{
	if (Folder(c_ilexSaveFolder).exists) {
		return true;
	}
	else {
		// Folder doesn't exist: try to create it
		try {
			var tF = new Folder(c_ilexSaveFolder);
			tF.create();
			alert("New folder " + c_ilexSaveFolder +
				"\nI have created this folder on your desktop as an out-tray for Ilex files...")
			return true;
		}
		catch (err) {
			// Error returns false
			myAlert("Target folder " + c_ilexSaveFolder +
				" doesn't exist and I failed to create it. Please create the folder " +
				"manually (you *must* name it \"_Ilex\" [underscore + \"Ilex\"]); then try again...", "Folder error")
			return false;
		}
	}
}
// CHECK ILEX TARGET FOLDER ends


// GET NEXT SATURDAY
// Called from saveToCCI
// Returns next Saturday (as Date object)... unless it's after noon on Thursday,
// in which case it skips to Saturday following
// This is default issue date for CCI options dialog
function getNextSaturday(isChart)
// Param = true for standard charts through Save CCI (above in this module), which uses Thursday noon cutoff
// False if called from Kindle/Indicators.jsx...
//
{
	// Today's date + time
	var myNow = new Date();
	// Pull out day (Sun=0 to Sat=6) and hour
	var myDay = myNow.getDay();
	var myHour = myNow.getHours();

	// Time to Saturday in ms
	var toSat = (6 - myDay) * local_oneDay;
	// Issue date is Saturday; get as time in ms
	var issueTime = myNow.getTime() + toSat;

	// If this is ordinary chart (not (Kindle) Indicators, there's a cutoff at noon Thursday
	if (isChart) {
		// If current time is after 6pm Thursday, jump ahead to following Saturday
		if ( (myDay > 4) ||
			( (myDay == 4) && (myHour > 18) ) ) {
				issueTime += local_oneWeek;
		}
	}
	else {
		// This is for (Kindle) Indicators, so anything after end of Friday (ie, on Saturday) is next week
		if (myDay > 5) {issueTime += local_oneWeek};
	}
	// Return default-issue Saturday as date
	return new Date(issueTime);
}
// GET NEXT SATURDAY ends


// GET DATE FROM FILENAME
// Called from saveToCCI
// If the file already has a name, this function extracts the date element
// and returns a date object (in ms)
function getDateFromFilename (thisDoc)
{
	var y = parseInt(thisDoc.name.slice(0,4));
	var m = parseInt(thisDoc.name.slice(4,6) - 1);
	var d = parseInt(thisDoc.name.slice(6,8));
	return new Date(y, m, d)
}
// GET DATE FROM FILENAME

// MAKE SCRATCH NAME
// Works out file name from date object
// If an error occurs, returns randomly generated name
// File extension is NOT returned
function makeScratchName(withDate)
// Arg is file's issue date (default or inherited) as a date object (in ms)
// newFile is true if this is a completely new file (not subsequent panel or re-opened from Done folder)
{
	try {
		// Get issue date as yyyy-mm-dd string
		var sName = dateToYYYYMMDD(withDate);
		// Underscore
		sName += c_underscore;

		// Next sectionID, chart identifier ("C") and number; all lifted from the name inherited from Research
		// sectionID is last 2 chars
		n = g_chartName.length;
		// ID and "C"
		sName += g_chartName.slice(n-2) + g_chartName.slice(n-3, n-2)
		// Number
		sName = sName + g_chartName.slice(0,3);
		return sName;
	}
	catch(err) {
		// File is assigned random 3-digit number
		var errName = "99999999_SSC000"
		msg = "I was unable to convert the name of the imported Research file into a valid Illustrator filename.\n" +
			"The chart will be saved under a default file name and you should rename it manually. " +
			"If this problem reoccurs, please advise:\n     " + g_authorContact;
		myAlert(msg, errName);
		return errName;
	}
}
// MAKE SCRATCH NAME ends


// DATE TO YYYY MM DD
// Called from makeScratchName
// Passed a date object, returns yyyy-mm-dd string
function dateToYYYYMMDD(dObj)
{
	var myDate = new Date(dObj);
	var m = (myDate.getMonth() + 1).toString();
	if (m.length == 1) {m = "0" + m};
	var d = (myDate.getDate()).toString();
	if (d.length == 1) {d = "0" + d};
	var dStr = myDate.getFullYear().toString() + m + d;
	return dStr;
}
// DATE TO YYYY MM DD ends

// SET TIGHT CROP
// Sets crop tight on artwork
function setTightCrop(d) {
	var cbA = new Array(4);
	var foundArtwork = false;

	// With CS4, CCI needs artboard set tight on artwork
	// Find the artwork...
	try {
		var bb1 = d.pathItems[c_backBoxN + "1"];
		foundArtwork = true;
	}
	catch (err) {
		try {
			var bb1 = d.pageItems["Text Block"];
			foundArtwork = true;
		}
		catch (err) {
			msg = "Unable to set CCI-compatible artboard. The file will be saved " +
				"with a full-page artboard. I recommend that you keep the file open, " +
				"then set the artboard to the size of the drawing and save manually...";
			myAlert(msg, "Sorry");
		}
	}

	if (foundArtwork) {
		cbA[0] = bb1.left;
		cbA[1] = bb1.top;
		cbA[2] = bb1.left + bb1.width;
		cbA[3] = bb1.top - bb1.height;
		d.cropBox = cbA;
	}

}
// SET TIGHT CROP ends


// PRINT DOC
// Called from saveIlexFile
// Prints ONE COPY with details box, which is deleted
// Also adjust crop for details box
function printDoc(pDoc, oName, xmpObj, dString)
// Args are active document object, name to show in "temp" details string,
// and xmp object with displayed properties
{
	var fnRange;
	var fnPos = Array(2);
	var testLayer;
	//var oName= pDoc.name;
	var n;
	var i;
	var lockedStatus = false;
	var visibleStatus = true;
	var pngFlag = false;
	// XMP object
	var xmpProperties;

	// Do we want a printout?
	// Comm'd out, Jan 17, at general request...
	var wantPrint = confirm("Do you want to print " + oName + "?", false, oName);
	if (!wantPrint) {
		return;
	}

	// Still here? Details box:
	if (!g_panelExists) {		// && (g_showDetails)) {
		if (!drawBoxes(dString)) {
			return false;
		}
	}

	// Get current document crop
	var tempCrop = pDoc.cropBox;

	var cropChangedFlag = false;
	// Display short chart details string if no details layer
	try {
		detailsLayer = pDoc.layers["Details"];
		cropChangedFlag = true;
		// Try to reset crop box to include surviving Details box...
		tempCrop[2] = testLayer.groupItems[0].left + testLayer.groupItems[0].width + 1;
		tempCrop[3] = testLayer.groupItems[0].top - testLayer.groupItems[0].height - 1;
		pDoc.cropBox = tempCrop;
	}
	catch (err) {}

	var pOptions = new PrintOptions();
	var jOptions = new PrintJobOptions();
	jOptions.copies = 1;
	pOptions.jobOptions = jOptions;
	pDoc.print(pOptions);

	// If I created a filename range at bottom right, kill it.
	try {
		detailsLayer.remove();
	}
	catch (err) {};


	if (cropChangedFlag) {
		// Crop was adjusted for Details box; reset tight to artwork
		setTightCrop(pDoc);
	}

}
// PRINT DOC ends

// SAVE FILE
// Called from saveIlexFile to do actual save...
function saveFile(fObj, fName)
// Args are active document *object* and complete path to which to save it
{
	// var cbA = new Array(4);
	try {
		var fileSpec = new File(fName);

		var saveOptions = new EPSSaveOptions();

		saveOptions.compatibility = Compatibility.ILLUSTRATOR14;
		saveOptions.preview = EPSPreview.COLORMACINTOSH;
		saveOptions.overprint = PDFOverprint.PRESERVEPDFOVERPRINT;
		saveOptions.embedAllFonts = true;
		saveOptions.includeDocumentThumbnails = true;
		saveOptions.cmykPostScript = true;
		saveOptions.postscript = EPSPostScriptLevelEnum.LEVEL2;

		fObj.saveAs(fileSpec,saveOptions);
	}
	catch (err) {
		alert("trouble")
		return false;
	}
	return true;
}
// SAVE FILE ends


// SET XMP
// Applies XMP properties to document
function setXMP(doc, xmpObj) {
	// Fcn in utilities loads XMP lib.
	if (loadXMPLibrary()) {
		xmp = new XMPMeta();
		xmp.setProperty(XMPConst.NS_XMP, "researcher", xmpObj.researcher);
		xmp.setProperty(XMPConst.NS_XMP, "cartographer", xmpObj.cartographer);
		xmp.setProperty(XMPConst.NS_XMP, "workstation", xmpObj.workstation);
		//xmp.setProperty(XMPConst.NS_XMP, "installation", xmpObj.installation);
		xmp.setProperty(XMPConst.NS_XMP, "dropfolder", xmpObj.dropfolder);
		xmp.setProperty(XMPConst.NS_XMP, "lasteditor", xmpObj.lasteditor);

		// As a test, push subtitle (in global) into the Metadata Description field:
		xmp.setProperty(XMPConst.NS_DC, "description", g_subtitle);

		// serialize the XMP packet to XML.
		var xmpStr = xmp.serialize();
		// Save XMP back to doc.
		doc.XMPString = xmpStr;
		// And unload library
		unloadXMPLibrary();
	}
	else {
		alert("Failed to update XMP data...");
	}
}
// SET XMP ends

// GET XMP PROPERTIES
// Function returns an object defining XMP properties.
function getXMPProperties(doc) {
	var xmpObj, fsnA, w;
	xmpObj = {};
	// Original researcher and cartographer, passed into new charts with DataB.txt
	xmpObj.researcher = g_originator;
	xmpObj.cartographer = g_userName;
	// Workstation
	try {
		fsnA = $.getenv("HOME").split("/");
		w = fsnA[fsnA.length - 1];
	}
	catch (err) {
		w = "unknown";
	}
	xmpObj.workstation = w;
	// Drop folder is probably redundant.
	xmpObj.dropfolder = g_cciPath;
	// Current editor is retrieved from the 'userName' property of Local Prefs file
	xmpObj.lasteditor = getCurrentUser();
	return xmpObj;
}
// GET XMP PROPERTIES ends

// DO INFERENTIAL TWEAKS
// Called from Main.Ilex
// Carries out any site-specific inferential tweaks that I haven't
// found a more finely-structured way of dealing with...
function doInferentialTweaks()
{

	// Some 1-panel Indicators files move source string across...
	// Check if it's a single-panel, .CIN file...

	if ((g_chartName.length - g_chartName.search(".CIN")) == 4) {
		if (g_onePanelVisible) {
			if (g_totalPanelNo == 1) {
				g_sourceRange.left += 160;
			}
		}
	}

	// Scatter charts move horizontal scale ticks and strings above vertical...
	if (g_isRevamp) {
		// Tweak Nov'18, where for tables, this is undefined
		if (typeof g_overallStyle !== 'undefined') {
			if (g_overallStyle[0] == c_generalScatterConst) {
				moveHscaleUp();
			}
		}
	}

}
// DO INFERENTIAL TWEAKS ends

// MOVE H-SCALE UP
// Called from doInferentialTweaks. On scatters, moves the H-scale
// up the stack, above V-scale...
function moveHscaleUp() {
	var hScaleTicks = g_myDoc.groupItems["Horizontal scale ticks"];
	var hScaleStrings = g_myDoc.groupItems["Horizontal scale strings"];
	// V-scale can be left or right
	var vScaleTicks = g_myDoc.groupItems["Vertical scale ticks right"];
	if (typeof vScaleTicks === undefined) {
		vScaleTicks = g_myDoc.groupItems["Vertical scale ticks left"];
	}
	var vScaleStrings = g_myDoc.groupItems["Vertical scale strings right"];
	if (typeof vScaleStrings === undefined) {
		vScaleStrings = g_myDoc.groupItems["Vertical scale strings left"];
	}
	vScaleTicks.move(hScaleTicks, ElementPlacement.PLACEBEFORE);
	vScaleStrings.move(vScaleTicks, ElementPlacement.PLACEAFTER);

}
// MOVE H-SCALE UP ends

// DO TEXT TWEAKS
// Called from AI_primitives to carry out inferential tweaks to the content
// of any text range. Currently:
//		- italicises "The Economist"
function doTextTweaks(tR)
// Arg is a textFrame object
{
	// Italicise "The Economist"
	// Insert italics tags in string, then call function to italicise
	var e = "The Economist";
	var s = tR.contents;
	if (s.search(e) != -1) {
		var s = s.replace(e, c_italMarker + e + c_italMarker, "g");
		tR.contents = s;
		// Pass tagged textFrame to function in Keys.jsx
		makeEmphasis(tR,0);
	}
}
// DO TEXT TWEAKS ends


// GET CURRENT USER
// 	Called from Economist.saveIlexFile
// 	Looks in the Ilex application folder(the parent of the hard-coded "temp" folder)
//	 for the file "Local Prefs.txt". Extracts and returns the username property
function getCurrentUser()
{

	var lpFile;	  // local prefs file name
	var iStrings;	// text in local prefs file
	var userName, iArray, i, s;

	userName = "unknown";

	// Find application folder (containing prefs file), which is parent of
	// Temp folder (constant in Ilex.jsx and SaveCCI.jsx stubs)
	g_iFolder = new Folder(checkSep(c_tempFolder)).parent;

	// Local Prefs file:
	lpFile = g_iFolder.absoluteURI + c_pS + c_localPrefsFile;
	// Read in about six lines of text
	iStrings = readInFile(lpFile);
	if (iStrings) {
		// Split into array by lines
		iArray = iStrings.split("\n");
		for (i = 0; i < iArray.length; i ++) {
			s = iArray[i];
			if (s.search("userName" >= 0)) {
				userName = s.split("==")[1];
				break;
			}
		}
	}
	else {
		// Invalid result:
		myAlert ("Unable to retrieve user name\n (Economist.getCurrentUser)", "General error");
	}
	return userName;
}
// GET CURRENT USER ends

// DRAW BOXES
// Called from saveToCCI
// Draws boxes containing chart details; these are deleted after printing.
function drawBoxes(myDate)
{
	var dbArray = new Array(7)		// strings array
	var ednDate, d;
	var myRect;
	var myText;
	var itemPoints;
	var w;
	var h;
	// Ouch!
	var monthList = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

	// Create new layer:
	g_detailsLayer = g_myDoc.layers.add();
	g_detailsLayer.name = c_detailsLayerN;
	setLayerColor(g_detailsLayer,c_detailsColor);
	// Background boxes are grouped
	g_detailsGroup = g_detailsLayer.groupItems.add();
	g_detailsGroup.name = c_detailsGroupN;

	// Populate strings array; labels and other elements are hard-coded and may stay that way...
	// Edition date as MMMdd, (from passed date obj)
	ednDate = monthList[myDate.getMonth()] + myDate.getDate();
	// Width & height to max 2 dec places
	w = g_chartWidth;
	if (w%1 > 0) {w = w.toFixed(2)}
	h = g_chartHeight;
	if (h%1 > 0) {h = h.toFixed(2)}

	if (itemLeft%1 > 0) {itemLeft = itemLeft.toFixed(2)};

	dbArray[0] = ["Edition",ednDate];
	dbArray[1] = ["Name",g_chartName];
	dbArray[2] = ["Width",w.toString()];
	dbArray[3] = ["Depth",h.toString()];
	dbArray[4] = [g_copyrightString];
	dbArray[5] = [c_originatorLayerN,g_originator];
	dbArray[6] = ["Cartographer",g_userName];
	//
	// Box attributes -- some hard-coded and may stay that way...
	var itemLeft = g_detailsOrigin[0];
	var itemTop =  g_detailsOrigin[1].toFixed(2);
	var myWidth = 190;	// Overall width; width of sub-boxes is calculated inside loop
	var itemDepth = 15;
	var itemFillFlag = false;
	var itemFillColourW = [0,0,0,0];
	var itemFillColourB = [0,0,0,100];
	var itemStrokeFlag = true;
	var itemStrokeWidth = .3;
	var itemStrokeColour = [0,0,0,100];
	var boxCounter = 1;
	var dbFontName = g_keyFontName;
	var dbFontSize = 8;
	for (i in dbArray) {
		try {
			var itemName = c_detailsBoxN + boxCounter;
			var itemNote = c_detailsBoxN + boxCounter;
			var itemWidth = myWidth;
			itemPoints = [itemTop,itemLeft,itemWidth,itemDepth];
			if (dbArray[i].length==1) {
				if (dbArray[i][0] == undefined) {break};
				// Only one string (copyright):
				myRect = makeRect(g_detailsGroup,itemPoints,itemFillFlag,itemFillColourW,
					itemStrokeFlag,itemStrokeWidth,itemStrokeColour,itemName,itemNote);
				myText = makeText(g_detailsGroup,[(itemTop-itemDepth/1.5),itemLeft+3],[0,0,0,100],
					dbFontName,dbFontSize,dbFontSize,0,0,100,myWidth,false,dbArray[i][0],
					"Copyright_string", "Copyright string", false);
			}
			else {
				// 2 strings, 2 boxes: label and details - break if no details
				if (dbArray[i][1] == undefined) {break};
				// L/H box is 1/3 of overall width
				var itemWidth = myWidth/3;
				var itemPoints = [itemTop,itemLeft,itemWidth,itemDepth];
				// "Number" L/H box is drawn black, with white text
				if (dbArray[i][0] == "Name") {
					// Label for chart number is wobbed
					var iFC = itemFillColourB;
					var itemFillFlag = true;
					var textCol = [0,0,0,0];
				}
				else {
					var iFC = itemFillColourW;
					var itemFillFlag = false;
					var textCol = [0,0,0,100];
				}
				// L/H box:
				myRect = makeRect(g_detailsGroup,itemPoints,itemFillFlag,iFC,
					itemStrokeFlag,itemStrokeWidth,itemStrokeColour,itemName,itemNote);
				myText = makeText(g_detailsGroup,[(itemTop-itemDepth/1.5),itemLeft+3],textCol,
					dbFontName,dbFontSize,dbFontSize,0,0,100,itemWidth,false,dbArray[i][0],
					"Details_label_" + i, "Details label " + i, false);
				// R/H box :
				itemLeft += itemWidth;
				itemWidth *= 2;
				itemPoints = [itemTop,itemLeft,itemWidth,itemDepth];
				myRect = makeRect(g_detailsGroup,itemPoints,itemFillFlag, itemFillColourW,
					itemStrokeFlag,itemStrokeWidth,itemStrokeColour,itemName,itemNote);
				myText = makeText(g_detailsGroup,[(itemTop-itemDepth/1.5),itemLeft+3],[0,0,0,100],
					dbFontName,dbFontSize,dbFontSize,0,0,100,itemWidth,false,dbArray[i][1],
					"Details_string_" + i,"Details string " + i, false);
			}
		}
		catch (err) {
		// Failure to draw any one row:
			msg = "I encountered this error trying to draw details box for " + dbArray[i][0] +
				".\nI'm pressing on; please check the details box when I've finished..."
			myAlert(msg, "Error: " + err);
			// Don't break loop, though: press on...
		}
		++boxCounter;
		itemTop -= itemDepth;
		itemLeft = g_detailsOrigin[0];
	}
	return true
}
// End DRAW BOXES




//	*** REDUNDANT BELOW ***
//	But retained in case I want to cannibalise...


// CCI OPTIONS
// Called from saveToCCI to display CCI options dialog
// Passed default issue date, sets globals to:
//	user-determined date
//	desktop-save option
//	pdf option
//	print option
//	close file option?
// Returns true if user wants to save to CCI...
function cciOptions(firstDate, selectedDate, closeOption, needsNewName)
// Params are: 	"this week" (Saturday): will be first item in drop-down list
//				selected date in list; if file is for a future issue, this will differ from firstDate
//				flag whether option to close file should be offered
//				needsNewName is true if "virgin" file
//
{
	alert("Running cciOptions, which I shouldn't be doing...");
	return false;

	var showResult = false;
	var dateStrArray = new Array(10);	// dates as strings (dd mmm yyyy)
	var dateObjArray = new Array(10);	// date objects
	var ddIndex = 0;					// default selection index in dropdown
	// Get "this week" in ms; this will increment to create list
	var myTime = firstDate.getTime();
	var myFName = makeScratchName(selectedDate.getTime(), needsNewName)

	// The list will start from "this week" and run for ten weeks
	// I want to select the file date by default. If the file is new, this is the same as the first week; but
	// if we're looking at an existing file for a future issue, it's that later issue date
	// So I get the "selected" date as a string for comparison...
	var selectedDateStr = selectedDate.getDate() + " " + monthName(selectedDate.getMonth(), 2) + " " + selectedDate.getFullYear();
	var tempCCIPath;

	// Construct parallel arrays of issue dates: 10 weeks from this week...
	//	One array of date objects
	//	Another constains string representations of each date, as dd mmm yyyy (these appear in list)
	for ( var i = 0; i < dateStrArray.length; i++ ) {
		var d = new Date ( myTime );
		var s = d.getDate() + " " + monthName(d.getMonth(), 2) + " " + d.getFullYear();
		// 		(monthName is in Utilities &, with "2" param, returns month as 3-char string)
		// Compare each date in the list with the selected date string I created just above
		// When they match, "i" is the required default dropdown index
		if (s == selectedDateStr) {ddIndex = i};
		dateStrArray[i] = s;
		dateObjArray[i] = d;
		myTime += local_oneWeek;
	}

	// Inferential removal of Windows path prefix moved into getXMP
	// since I think we're just converting upon first Save CCI...

	// Header string
	var headString = "Is this what you were expecting? If it looks okay, click \"Save\" to save this file to the folder:"
	var subString = "Tick the checkbox below if you prefer to save to your desktop...";

	// Dialog
	var dlg = new Window("dialog", "Save " + myFName + " ?");
	dlg.size = [400, 350];
	// Header
	dlg.headText = dlg.add("statictext", [25, 20, 350, 50], headString, {multiline:true});
	// Folder string (in read-only edit box)
	// var fileNameText = dlg.add("edittext", [25, 60, 350, 80], c_cciPath, {multiline:false, readonly:true});
	var fileNameText = dlg.add("edittext", [25, 60, 350, 80], g_cciPath, {multiline:false, readonly:true});
	// Sub-string
	dlg.subText = dlg.add("statictext", [25, 90, 350, 130], subString, {multiline:true});

	// Group to hold two panels
	var myGrp = dlg.add("group", [20, 130, 360, 250], {orientation: "column"});
	// Define panels here:
	// Issue date panel
	var ddPnl = myGrp.add("panel", [0, 5, 160, 120], "Issue date");
	// Options panel
	var optionsPnl = myGrp.add("panel", [180, 5, 340, 120], "Options");


	// Populate issue date panel with dropdown
	var dDown = ddPnl.add ('dropdownList', [10, 30, 140, 50], dateStrArray);
	// Select default item
	dDown.selection = dDown.items[ddIndex];
	dDown.onChange = function () {
		var v = dateObjArray[dDown.selection.valueOf()].getTime();
		var wText = makeScratchName(v, needsNewName);
		dlg.text = "Save " + wText + " ?";
	};

	// UNDERSCORE ALERT
	// Eventually the dropdown must have an event handler that passes
	// any changed date to the Title bar

	// Populate options panel: PNG and Print checkboxes
	var desktopCB = optionsPnl.add("checkbox", [10, 20, 140, 40], "Desktop save only");
	var pngCB = optionsPnl.add("checkbox", [10, 40, 140, 60], "Save PNG too");
	var printCB = optionsPnl.add("checkbox", [10, 60, 140, 80], "Print");
	var closeCB = optionsPnl.add("checkbox", [10, 80, 140, 100], "Close file now");

	// Default states of checkboxes (on/off, en/disabled)
	// The "canEdit" flag is true for Graphics, false for Research
	if (g_canEdit) {
		// Graphics can edit files and have all options
		// Default state of "Close file now" and "Print" checkboxes
		closeCB.value = !needsNewName;
		printCB.value = !needsNewName;
	}
	else {
		// Research are in create-and-inspect mode...
		desktopCB.value = false;	// desktop save disabled
		desktopCB.enabled = false;
		pngCB.value = true;		// png is on by default, but enabled
		printCB.value = true;	   // printout is on by default, but enabled
		closeCB.value = true;	   // close is forced
		closeCB.enabled = false;
		dDown.enabled = false;	   // and dates dropdown is frozen on "this week"
	}

	// Option event handlers
	desktopCB.onClick = function() {
		if (desktopCB.value == true) {
			fileNameText.text = g_desktopPath;
		} else {
			fileNameText.text = g_cciPath
		}
	};

	// OK/Cancel buttons
	var btnGrp = dlg.add("group", [200, 350, 380, 390], {orientation: "column"});
	var cancelBtn = btnGrp.add("button", [0, 10, 80, 20], "Cancel", {name: "cancel"});
	var okBtn = btnGrp.add("button", [100, 10, 180, 20], "Save", {name: "ok"});


	// OK and Cancel button click events pack globals
	okBtn.onClick = function() {
		local_dateStrChosen = dDown.selection.toString();				// chosen date as string
		local_dateObjChosen = dateObjArray[dDown.selection.valueOf()];	// chosen date as object
		local_desktopOption = desktopCB.value;
		local_pngOption = pngCB.value;
		local_printOption = printCB.value;
		local_closeOption = closeCB.value;
		// Returns true
		showResult = true;
		dlg.close();
	};
	cancelBtn.onClick = function() {
		// Do I need to set any of the internal globals?
		dlg.close();
	};

	dlg.show();


	return showResult;

}
// CCI OPTIONS ends
