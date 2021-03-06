﻿/* Column traces

Created 15.12.05
Updated 23.9.08 (tracks whether keys are for traces attached to left or right scale)

- 	drawCols
		controls loop to draw complete column trace
-	tColsObject
		object constructor; creates trace object whose properties define all attributes
		of a columns trace (including array of ALL coords for each individual column)
-	colLArray
		called from tColsObject to work out left coords for all cols in all substyles
-	breakRect

*/

// $.level=1;

// DRAW COLS
// Called from Main.drawTraces to draw ONE column trace (whichever substyle)
// Creates column trace object whose properties define this trace
// Calls columns constructor to draw actual array of columns
function drawCols(pts, tNo, allT, toLeft, subStyle)
// Args are 		array of points (raw values)
//				trace number (from 1)
//				total number of traces
//				left/right scale attachment
//				sub-style constant
{
	var tCols;		// properties object
	var myBlobs;
	var i;
	var bsFlag;		// local broken scale flag
	var accum;
	if (toLeft) {
		bsFlag = g_isBS[0];
		accum = g_accumulate[0]
	}
	else {
		bsFlag = g_isBS[1];
		accum = g_accumulate[1]
	}


	// Trace group
	g_colGroup = g_traceLayer.groupItems.add();
	g_colGroup.name = c_tcolGroupN + tNo;
	// Properties object

	tCols = new tColsObject(pts, tNo, allT, toLeft, subStyle)
	// Blobs for this trace?
	myBlobs = traceHasBlobs(tNo, allT)	// left undefined if no blobs (function in Utilities)
	if (!(myBlobs == undefined)) {
		// Set up a group
		g_blobGroup = g_panelLayer.groupItems.add();
		g_blobGroup.name = c_blobGroupN + tNo;
		// Blob headers(s) (in GenTraces)
		drawBlobHeads()
	}

	// Loop column by column...
	for (i = 0; i < tCols.points.length; i ++) {
		thisCol = makeRect(g_colGroup, tCols.points[i],
			tCols.fFlag, tCols.fCol,
			tCols.sFlag, tCols.sWidth, tCols.sCol,
			tCols.name, tCols.note);

		// Broken scale
		// ...at bottom?
		if (bsFlag) {
			if ((accum) || (subStyle == c_colStackedConst)) {
				if (tNo == 1) {
					breakRect(thisCol, true, true)
				}
			}
			else {
				breakRect(thisCol, true, true)
			}
		}
		// ...at top?
		if (!(g_breakTopScale == 0)) {
			if (tCols.points[i][3] > g_innerBox.height){
				// function is in Columns
				breakScaleTop(thisCol, tCols, pts[i], true)
			}
		}

		// Blobs for this trace?
		if (!(myBlobs == undefined)) {
			if (g_blobHeadArray.length < 3) {
				// One set of blobs: use x-centre of slot
				xCentre = (tCols.points[i][1] + (tCols.points[i][2] / 2));
			}
			else {
				// Multiple blob sets: use x-centre of this bar
				xCentre = tCols.points[i][1] + (tCols.points[i][2] / 2);
			}
			addColBlob(xCentre, i + 1, myBlobs[i], thisCol.top);
		}

	}

	// Add key object to array...
	g_keyArray[tNo-1] = new keyObject(tNo, c_generalColConst, tCols, 0, toLeft);

	return g_colGroup
}
// DRAW COLS ends


// DRAW THERMO COL TRACE
// Called from Main.Ilex to draw spots for column thermometers
// NOTE: pts are raw values
function drawThermoColTrace(pts, tNo, allT, toLeft, subStyle)
{
	var tSpots;		// properties object
	var myBlobs = undefined;
	var p;
	var temp;

	// Thermo min/max
	// tNo is a trace index, from 1
	// If tNo = 1, I create a series of objects in an array, each with a y-coord
	// Here's the empty array:
	g_thermoMinMaxArray = [];
	// Trace group
	g_colGroup = g_traceLayer.groupItems.add();
	g_colGroup.name = c_tcolGroupN + tNo;
	// Properties object
	tSpots = new tThermoSpotsObject(pts, tNo, allT, toLeft, subStyle);
	// Blobs for this trace?
	myBlobs = traceHasBlobs(tNo, allT)	// left undefined if no blobs (function in Utilities)
	if (!(myBlobs == undefined)) {
		// Set up a group
		g_blobGroup = g_panelLayer.groupItems.add();
		g_blobGroup.name = c_blobGroupN + tNo;
		// Blob headers(s) (in GenTraces)
		drawBlobHeads()
	}

	// tSpots.points is an array of (I hope!) x/y coords
	// Array to assemble y-coord of each point in this trace
	var yCoordArray = [];

	// Loop spot by spot...
	for (i = 0; i < tSpots.points.length; i ++) {
		// Call spot builder (with trace group; attributes; spot number; scatter flag)
		drawSpot(g_colGroup, tSpots, i, false)
		// Blobs?
		if ((tNo == 1) && (!(myBlobs == undefined))) {
			addColBlob(tSpots.points[i][0], i + 1, myBlobs[i], g_innerBox.top);
		}
		// Append y value to array
		yCoordArray.push(tSpots.points[i][1]);
	}
	// Append array of y-coords to global array
	g_thermoRawPointArray.push(yCoordArray);
	// Add key object to array... ---- CODE ENTERED 15.02.06 BUT NOT CHECKED
	// Modded Jan 2016: sending GENERAL scatter constant...
	g_keyArray[tNo-1] = new keyObject(tNo, c_colThermoConst, tSpots, 0, toLeft);
	return g_colGroup
}
// DRAW THERMO COL TRACE


// T-COLS OBJECT
// Called from drawCols
// Constructor for an object whose properties define a trace of columns
function tColsObject(ptArray, tNo, allT, toLeft, subStyle)
// Args are: 	array of trace values
//				trace number (from 1)
//				total number of traces
//				flag: left or right scale
//				sub-style constant
{
	var i;					// counter
	var j = 0;				// counter
	var cBase;				// baseline
	var inverted;
	// Trace attributes loop after a certain point...
	var tStyleNo = tNo;
	var originalTNo = tNo;
	while (tStyleNo > c_traceLoopNo) {tStyleNo -= c_traceLoopNo};

	// But if this is first trace of only one, check the "use style 2 for one trace" flag
	if ((tStyleNo == 1) && (allT == 1)) {
		if (g_oneBarColUsesStyleTwo) {tStyleNo = 2};
	}

	var bsAllow = 0;		// broken scale margin depth (none by default)
	var colTotal;			// number of traces
	var accum;			// accumulation flag left or right

	// Identifier for stacked/unstacked fill set:
	var colStyleInsert;

	// Left/right:
	//	broken scale?
	// 	which scale might I be inverting?
	if (toLeft) {
		if (g_isBS[0]) {bsAllow += g_brokenScaleMargin};
		inverted = g_invertedScaleA;
		accum = g_accumulate[0]
	}
	else {
		if (g_isBS[1]) {bsAllow += g_brokenScaleMargin};
		inverted = g_invertedScaleB;
		accum = g_accumulate[1]
	}

	// Baseline defaults to bottom of inner box (may be overwritten by zero line, see below)
	if (inverted) {
		cBase = (g_innerBox.top - bsAllow);
	}
	else {
		cBase = (g_innerBox.top - (g_innerBox.height + bsAllow));
	}
	// Four co-ord arrays:
	var ptLen = ptArray.length;
	var tArray = new Array(ptLen);			// tops
	var lArray = new Array(ptLen);			// lefts
	var wArray = new Array(ptLen);			// width(s)
	var hArray = new Array(ptLen);			// heights
	// The final array will have point-number elements, each consisting of
	// a 4-slot array defining each col's top, left, width & height
	var cTraceArray = new Array(ptLen);	//

	// Tops: for each col, call calcYValuePos in GenTraces module
	for (i in ptArray) {
		tArray[i] = calcYValuePos(ptArray[i],toLeft);
	}

	// Lefts
	// First, "Cluster position" (this has been problematic)
	// If we've a double scale we need, not the total number of traces,
	// but the number of COLUMN traces
	if (g_doubleScale > 0) {
		if ((g_overallStyle[0] == c_generalColConst) && (!(g_overallStyle[1] == c_generalColConst))) {
			colTotal = g_doubleScale;	// was +=
		}
		else if ((g_overallStyle[1] == c_generalColConst) && (!(g_overallStyle[0] == c_generalColConst))) {
			colTotal = allT - g_doubleScale;
			// colTotal += (colTotal - g_doubleScale); comm'd out jan 06
			if (tNo > g_doubleScale) {
				tNo -= g_doubleScale;
			}
		}
		else {
			colTotal = allT;
		}
	}
	else {
		// No double scale, so use total no. of traces
		colTotal = allT;
	}

	lArray = colLArray(ptLen, tNo, colTotal, subStyle);
	// colLArray also calc'd width and assigned to global
	// Width(s) -- same value for each

	for (i = 0; i < wArray.length; i ++) {
		wArray[i] = g_colWidth;
	}

	// Heights
	// Default baseline set (above) to bottom of inner box
	// But if scale (left or right) straddles -- or tops at -- zero... use zero line
	if (toLeft) {
		if ((g_highA >= 0) && (g_lowA < 0)) {cBase = g_cbBase[0]};
	}
	else {
		if ((g_highB >= 0) && (g_lowB < 0)) {cBase = g_cbBase[1]};
	}

	// Accumulation
	if ((accum) || (subStyle == c_colStackedConst)) {
		// 10 Apr version
		for (i = 0; i < g_valArray[0].length; i ++) {
			// Set defaults on first loop:
			if (tNo == 1) {
				g_prevTopsArray[i] = cBase;
				g_prevBottomsArray[i] = cBase;
			}
			// Are vals +/- ?
			if (ptArray[i] >= 0) {
				// Col height is always unaccum’d pos - base
				hArray[i] = tArray[i] - cBase;
				// Top is prev + height: remember and set for this loop
				tArray[i] = g_prevTopsArray[i] + hArray[i];
				g_prevTopsArray[i] = tArray[i];
			}
			else {
				// Neg vals: same but upside down
				hArray[i] = cBase - tArray[i];
				tArray[i] = g_prevBottomsArray[i];
				g_prevBottomsArray[i] -= hArray[i];
			}
		}
		// Identifier for stacked fill set:
		colStyleInsert = 'Stacked';
		// Accumulated options end

	}
	else {
		// Non-accumulated
		for (i = 0; i < hArray.length; i ++) {
			hArray[i] = tArray[i] - cBase;
		}
		// Identifier for stacked fill set:
		colStyleInsert = 'Unstacked';
	}
	// Combine arrays
	for (i = 0; i < ptArray.length; i ++) {
		// If there is a skipped value ("*"), don't pass to
		// combined array, which is shortened by 1 element
		if (tArray[i] == undefined) {
			cTraceArray.pop();
		}
		else {
			// Combined array uses separate counter to allow for skipped values
			cTraceArray[j] = Array(tArray[i],lArray[i],wArray[i],hArray[i]);
			j ++;
		}
	}
	this.points=cTraceArray;

	// Fill is forced for columns
	this.fFlag = true;

	if (g_isRevamp) {
		// Revamp:
		// Fill colour is subject to double-scale override:
		if (g_doubleScale > 0) {
			// Double scale
			if (originalTNo == 1) {
				// Left-scale trace 1 uses Left1
				this.fCol = g_doubleScaleLeftTrace1CMYK;
			}
			else if (originalTNo <= g_doubleScale) {
				// Other left-scale series
				this.fCol = g_doubleScaleLeftTrace2CMYK;
			}
			else if (originalTNo === (g_doubleScale + 1)) {
				// Right-scale trace 1 uses Left1
				this.fCol = g_doubleScaleRightTrace1CMYK;
			}
			else {
				// Other right-scale series
				this.fCol = g_doubleScaleRightTrace2CMYK;
			}
		}
		else {
			// Non-double: use trace-numbered colour
			eval("this.fCol = g_tCB" + colStyleInsert + tStyleNo + "FillCMYK");
		}
	}
	else {
		// Pre-revamp:

		// Fill colour is subject to double-scale override:
		// 	if this is 1st trace either side on a doublescale, use the
		// 	GP-defined left/right colour for doublescale charts
		// NOTE: 26.5.16 -- this doesn't quite square with options in
		// I_Print > General Prefs.txt...
		if ((g_doubleScale > 0) && (originalTNo == 1)) {
			this.fCol = g_doubleScaleLeftTrace1CMYK;
		}
		else if ((g_doubleScale > 0) && (originalTNo == (g_doubleScale + 1))) {
			this.fCol = g_doubleScaleRightTrace1CMYK;
		}
		else {
			// Non-double and/or all traces after second use trace-numbered colour
			eval("this.fCol = g_tCB" + tStyleNo + "FillCMYK");
		}
	}


	// Stroke
	this.sFlag = g_hasColStroke;
	eval("this.sWidth = g_tCB" + tStyleNo + "StrokeWidth");
	eval("this.sCol = g_tCB" + tStyleNo + "StrokeCMYK");

	// Other
	this.lineEnd = c_defaultLineEnd;
	this.lineMiter = c_defaultLineMiter;
	this.miterLimit = c_defaultLineMiterLimit;
	this.name = c_tColN + tNo;
	this.note = this.name;
}
// T_COLS OBJECT ends


// COL L-ARRAY
// Called from tColsObject to return left coords
// for ALL columns in trace
// ALSO assigns WIDTH to a global, g_colWidth (strictly speading, I should do this just
// once, since all traces use same col width. But structurally makes more sense here...
function colLArray(pNo, thisT, total, style)
// Args	number of points
//		trace number
// 		total number of traces
//		sub-style constant
{
	var  xpArray;			// array to return

	// Workaround if only one point. Set an arbitrary width
	// and put col at IB centre. Returns 1-element array.
	if (pNo == 1) {
		g_colWidth = (g_innerBox.width / 4);
		xpArray = Array(0);
		xpArray[0] = g_innerBox.left + (g_innerBox.width / 8 * 3);
		return xpArray;
	}

	var i;									// counter
	var xMove = g_innerBox.width / (pNo - 1);	// x-distance between points
	var thisP = g_innerBox.left;				// initial position is centre of first slot
	xpArray = Array(pNo);

	// Never let gap be wider than column/cluster
	// NOTE: comm'd out, Sep 2017: causing problems and it never
	// really fixed anything in the first place
	// if (g_cbGap > (xMove / 2)) {
	// 	g_cbGap = (xMove / 2);
	// }

	if (total == 1) {
		// Only 1 trace -- just lose the gap; left is always slot-left
		g_colWidth = xMove - g_cbGap;
		thisP -= (g_colWidth/2);
	}
	else if ((style == c_colThermoConst)) {
		// Thermometer -- use centre
		// Width remains undefined
		g_colWidth = xMove
		thisP -= 0	//(g_colWidth/2)
	}
	else {
		switch (style) {
			case c_colSideBySideConst:			// Sidebyside --
				g_colWidth = ((xMove - g_cbGap) / total)
				thisP -= ((xMove - g_cbGap) / 2)
				thisP += (g_colWidth * (thisT - 1));
				break;
			case c_colStackedConst:				// Stacked -- just lose the gap
				g_colWidth = xMove - g_cbGap
				thisP -= (g_colWidth / 2)
				break;
			case c_colOverlapConst:				// Overlap --
				g_colWidth = ((xMove - g_cbGap) / (total + 1) * 2)
				thisP -= ((xMove - g_cbGap) / 2)
				thisP += (g_colWidth / 	2) * (thisT - 1)
				break;
		}
	}
	for (i = 0; i < pNo; i ++) {
		xpArray[i] = thisP;
		thisP += xMove;
	}
	return xpArray;
}
// COL L-ARRAY ends


// BREAK RECT
// Zigzags column or bar rectangle to indicate broken scale
function breakRect(rect, isCol, isStart)
// Args are 	pathitem (individual column or bar)
//			column/bar flag
//			bottom-top (column) / left-right (bar) flag
// Note that the 3rd arg determines the shape of the zigzag
{

	// If I'm breaking the top/right of a column/bar that has
	// already been broken at the bottom/left, trip a flag:
	var isBoth = false;
	if (!isStart) {
		if (rect.pathPoints.length > 4) {isBoth = true};
	}

	// Existing bounds: left, right, top, bottom
	var l = rect.left;
	var r = rect.left + rect.width;
	var t = rect.top;
	var b = rect.top - rect.height;

	var rectSide;		// holds top, bottom, left or right

	var pArray = new Array(3);	// array sized to 4 existing points
	var p;						// individual pathPoints
	var bDist;					// distance between new points
	var along;					// coords along breaking side of col/bar
	var spliceFrom;				// holds no. of point (1-4) after which to insert new points
	var hMove;
	var vMove;

	var spliceXtra = 0;

	if (isCol) {
		// Column
		// Get existing pathPoint coords, from bottom left
		pArray[0] = Array(l,b);	// b/l
		pArray[1] = Array(l,t);	// t/l
		pArray[2] = Array(r,t);	// t/r
		pArray[3] = Array(r,b);	// b/r


		// H-distance between break points
		bDist = rect.width/c_breakNo;


		// If col is already broken at bottom, add those coords to the array:
		if (isBoth) {
			rectSide = b;
			spliceFrom = 0;
			along = r;
			hMove = bDist;
			vMove = bDist;
			// Splice new pathPoints into points array
			for (i = 1; i < c_breakNo; i ++) {
				along -= vMove;		// bDist;
				if ((i % 2) == 0) {
					pArray.splice(spliceFrom + i - 1, 0, Array(along,rectSide));
				}
				else {
					pArray.splice(spliceFrom + i - 1, 0, Array(along,rectSide + hMove));
				}
			spliceXtra ++;
			}
		}

		// So I now (hopefully!) have a coherent array of points for
		// a column which may or may not be broken at the bottom

		// Now work out new points

		if (isStart) {
			// Bottom
			rectSide = b;
			spliceFrom = 0;
			along = r;
			hMove = bDist;
			vMove = bDist;
		}
		else {
			// Top
			rectSide = t;
			//bDist = (0 - bDist);
			hMove = bDist;
			vMove = 0 - bDist;
			spliceFrom = 2 + spliceXtra;
			along = l;			// left
		}
		// Splice new pathPoints into points array
		for (i = 1; i < c_breakNo; i ++) {
			along -= vMove;		// bDist;
			if ((i % 2) == 0) {
				pArray.splice(spliceFrom + i - 1, 0, Array(along,rectSide));
			}
			else {
				pArray.splice(spliceFrom + i - 1, 0, Array(along,rectSide + hMove));
			}
			// Append new pathPoints (not anchored)
			rect.pathPoints.add();
		}

		// Finally reset points along entire path from b/l
		for (i = 0; i < rect.pathPoints.length; i ++) {
			p = rect.pathPoints[i]
			p.anchor = pArray[i];
			p.leftDirection = pArray[i];
			p.rightDirection = pArray[i];
			p.pointType = PointType.CORNER
		}


	}
	else {
		// Bar
		// Get existing pathPoints, from top left
		pArray[0] = Array(l,t);	// t/l
		pArray[1] = Array(r,t);	// t/r
		pArray[2] = Array(r,b);	// b/r
		pArray[3] = Array(l,b);	// b/l

		// V-distance between break points
		bDist = rect.height/c_breakNo;

		// If bar is already broken at bottom, add those coords to the array:
		if (isBoth) {
			rectSide = l;	// left
			spliceFrom = 0;
			along = b;
			hMove = bDist;
			vMove = bDist;
			// Splice new pathPoints into points array
			for (i = 1; i < c_breakNo; i ++) {
				along += vMove; //bDist;
				if ((i % 2) == 0) {
					pArray.splice(spliceFrom + i - 1, 0, Array(rectSide, along));
				}
				else {
					pArray.splice(spliceFrom + i - 1, 0, Array(rectSide + hMove, along));
				}
				spliceXtra ++;
			}
		}

		if (isStart) {
			rectSide = l;	// left
			spliceFrom = 0;
			along = b;
			hMove = bDist;
			vMove = bDist;
		}
		else {
			rectSide = r;
			spliceFrom = 2 + spliceXtra;
			//bDist = (0 - bDist);
			hMove = bDist;
			vMove = 0 - bDist;
			along = t;
		}
		// Append new pathPoints
		for (i = 1; i < c_breakNo; i ++) {
			along += vMove; //bDist;
			if ((i % 2) == 0) {
				pArray.splice(spliceFrom + i - 1, 0, Array(rectSide, along));
			}
			else {
				pArray.splice(spliceFrom + i - 1, 0, Array(rectSide + hMove, along));
			}
			// Append new pathPoints (not anchored)
			rect.pathPoints.add();
		}

		// Now reset points along entire path from b/l
		for (i = 0; i < rect.pathPoints.length; i ++) {
			p = rect.pathPoints[i]
			p.anchor = pArray[i];
			p.leftDirection = pArray[i];
			p.rightDirection = pArray[i];
			p.pointType = PointType.CORNER
		}
	}
}
// BREAK RECT ends


// BREAK SCALE TOP
// Called from drawBars & drawCols to draw the jagged section of a bar/column
// that breaks the scale at the top...
// Jag end of existing bar; draw extension with one end jagged; draw value on top.
function breakScaleTop(bRect, rAttributes, bVal, isCol)
// Args are:		object to break
//				object's attributes (fill etc.)
//				value
//				true=column / false=bar
// And note that g_breakTopScale = original inner box --
//	for cols: top
//	for bars: far right
// So I'm operating, vertically or horizontally between the top/right of the
// current inner box and the top/right of the extension margin
{
	var extRect;
	var extGrp;
	var extPts = new Array(3);
	var labPts = new Array(1);
	var extLab;
	var labSize;

	// Extension path and label will be grouped:
	extGrp = g_traceLayer.groupItems.add();
	extGrp.name = "Trace extension";
	if (isCol) {
		// COLUMN
		// 1) Jag end of existing bar
		// Set height so that end projects beyond inner box by 5 points
		bRect.height = (g_innerBox.top + 5 - g_hScaleBase);	//(g_innerBox.height + 5);
		bRect.top = (g_innerBox.top + 5);
		breakRect(bRect, true, false);
		// 2) Extension
		// Coords (top, left, width, height) :
		extPts[0] = g_breakTopScale;
		extPts[1] = bRect.left;
		extPts[2] = bRect.width;
		extPts[3] = g_breakTopScale - bRect.top;
		extRect = makeRect(extGrp, extPts,
			rAttributes.fFlag, rAttributes.fCol,
			rAttributes.sFlag, rAttributes.sWidth, rAttributes.sCol,
			rAttributes.name, rAttributes.note);
		// Zigzag
		breakRect(extRect, true, true);
		// 3) Value label appears inside extension
		// Origin -- horiz
		labPts[1] = bRect.left + (bRect.width / 2);
		// Vert
		labSize = new getTFrameSize("0", g_hScaleFontName, g_hScaleMainFontSize, 100, true, false);
		labPts[0] = g_breakTopScale - (labSize.height + 2);

		extLab = makeText(extGrp, labPts, g_brokenFontCMYK,
		g_hScaleFontName, g_hScaleMainFontSize, g_hScaleMainFontSize, c_cConst, 0, 100,
		0, false ,
		FormatNumberBy3(bVal), rAttributes.name, rAttributes.note, false);
	}
	else {
		// BAR
		// 1) Jag end of existing bar
		// Set width so that end projects beyond inner box by (somewhat arbitrary) margin
		// Width from baseline to innerBox.right, plus margin
		bRect.width = (g_innerBox. left + g_innerBox.width) - bRect.left + g_brokenScaleMargin;
		// Previous was: bRect.width = g_innerBox.width + g_brokenScaleMargin + 2;
		breakRect(bRect, false, false);
		// 2) Extension
		// Coords (top, left, width, height) :
		extPts[0] = bRect.top;
		extPts[1] = (bRect.left + bRect.width);
		extPts[2] = g_breakTopScale - extPts[1];
		extPts[3] = bRect.height;
		extRect = makeRect(extGrp, extPts,
			rAttributes.fFlag, rAttributes.fCol,
			rAttributes.sFlag, rAttributes.sWidth, rAttributes.sCol,
			rAttributes.name, rAttributes.note);
		// Zigzag
		breakRect(extRect, false, true);
		// 3) Value label appears inside extension
		// Origin -- horiz
		labPts[1] = g_breakTopScale - 2;
		// Vert -- provisional position
		//labSize = new getTFrameSize("0", g_vScaleFontName, g_vScaleFontSize, 100, true);
		//labPts[0] = extPts[0] - (extPts[3] / 2) - (labSize.height / 2);
		labPts[0] = extRect.top - extRect.height

		extLab = makeText(extGrp, labPts, g_brokenFontCMYK,
		g_vScaleFontName, g_vScaleFontSize, g_vScaleFontSize, c_rConst, 0, 100,
		0, false ,
		FormatNumberBy3(bVal), rAttributes.name, rAttributes.note, false);
		// Fine-tune vertical position
		vCentreTextOn(extLab, extRect);
	}
}
// BREAK SCALE TOP ends


// ADD COL BLOB
// Draws individual blob box FOR COLUMNS AND *LINES*
function addColBlob(bC, bNo, bString, cTop)
// Args are		horizontal (x) centre
//				point number (for item ID)
//				string
//				current col top or line point (for blobs that hug)
{
	// listArgs(arguments);
	var bG;						// group
	var bBox;					// box
	var bRange;					// text range
	var bPts = Array(3);			// box coords
	var sPts = Array(1);			// text anchor
	var bCentre = Array(1);		// centre coords

	// Group for this box and string:
	try {
		// Try to create object in blobs group
		bG = g_blobGroup.groupItems.add();
	}
	catch (err) {
		// If that fails, use trace layer
		bG = g_traceLayer.groupItems.add();
	}
	bG.name = c_blobN + bNo;

	// Skipped/missing value
	// if ((bString == c_skipConst) || (bString == undefined)) {bString = c_naConst};
	if ((bString == c_skipConst) || (bString == undefined)) {return};

	// Box
	// Get centre point
	// Vertical position depends on whether blobs "hug" the col / line-point or not...
	if (g_blobHugCols == undefined) {
		// blobs in a row at the top -- use remembered coord
		bCentre[1] = g_blobSize[2];
	}
	else {
		// hug top of col / line-point
		bCentre[1] = cTop + g_blobHugCols + (g_blobSize[1] / 2);
	}
	// x-centre
	bCentre[0] = bC;
	bPts[0] = bCentre[1] + (g_blobSize[1] / 2);	// top
	bPts[1] = bCentre[0] - (g_blobSize[0] / 2);	// left (yes, I know there's redundancy here...)
	bPts[2] = g_blobSize[0];						// width
	bPts[3] = g_blobSize[1];						// height

	// Draw box
	bBox = makeRect(bG, bPts, g_blobBoxFillFlag, g_blobBoxFillCMYK,
		g_blobBoxStrokeFlag, g_blobBoxStrokeWidth, g_blobBoxStrokeCMYK,
		bG.name, bG.name, true);

	// String (centre aligned) -- I want x,y
	sPts[1] = bCentre[0];
	// REVAMP: w/h array from lookup:
	sPts[0] = bPts[0] - bPts[3] + g_blobBoxMargin[1]; // top - height + margin
	bRange = makeText(bG, sPts, g_blobFontCMYK,
		g_blobFontName, g_blobFontSize, g_blobFontSize, c_cConst, 0, 100,
		0, false ,bString, bG.name, bG.name);
}
// ADD COL BLOB ends
