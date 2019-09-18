/* Bar traces

Created 05.01.06
Updated 22.04.13 (+/- accumulation)

- drawBars
	Overall controller
- addBarLabel
	Just draws text range in passed position
- tBarsObject
	Creates trace-defining object
- barTArray
	Creates array of individual bar tops and shared height

*/

// $.level=1;

// DRAW BARS
// Called from Main.drawTraces to draw ONE bar trace (whichever substyle)
// Creates bar trace object whose properties define this trace
// Calls bars constructor to draw actual array of bars
function drawBars(pts, tNo, allT, subStyle)
// Args are 	array of points (values)
//				trace number (from 1)
//				total number of traces
//				sub-style constant
{
	var tBars;		// properties object
	var thisBar;
	var i;
	var s;
	// Initialise an array for a set of blob values
	var myBlobs = undefined;
	var yCentre;		// centre vPos for blob box
	var accum = (g_accumulate[0] || g_accumulate[1])

	// Trace group
	g_barGroup = g_traceLayer.groupItems.add();
	g_barGroup.name = c_tbarGroupN + tNo;
	// Labels group
	g_barLabGroup = g_traceLayer.groupItems.add();
	g_barLabGroup.name = c_barLabGroupN;
	// Properties object
	tBars = new tBarsObject(pts, tNo, allT, subStyle);
	// Blobs for this trace?
	myBlobs = traceHasBlobs(tNo, allT)	// left undefined if no blobs (function in Utilities)

	if (!(myBlobs == undefined)) {
		// Blob header. Set up a group...
		g_blobGroup = g_panelLayer.groupItems.add();
		g_blobGroup.name = c_blobGroupN + tNo;
		// Blob header function, in GenTraces
		// (drawBlobHeads uses default blob-box height for header;
		//  individual blob boxes use reset height, below...)
		drawBlobHeads()
	}

	var slotDepth = (g_innerBox.height / tBars.points.length);
	// Loop bar by bar...
	for (i = 0; i < tBars.points.length; i ++) {
		thisBar = makeRect(g_barGroup, tBars.points[i],
			tBars.fFlag, tBars.fCol,
			tBars.sFlag, tBars.sWidth, tBars.sCol,
			tBars.name, tBars.note);

		// Broken scale?
		// ...at bottom?
		if ((g_isBS[0]) || (g_isBS[1])) {
			if ((accum) || (subStyle == c_colStackedConst)) {
				if (tNo == 1) {
					breakRect(thisBar, false, true);
				}
			}
			else {
				breakRect(thisBar, false, true);
			}
		}
		// ...at top?
		if (!(g_breakTopScale == 0)) {
			if (tBars.points[i][2] > (g_innerBox.width)){
				// function is in Columns
				breakScaleTop(thisBar, tBars, pts[i], false);
			}
		}

		// Label -- on first trace only
		if (tNo == 1) {
			// Vertical position:
			// (I'm not totally convinced about the gap measurement...)
			// vO = (tBars.points[i][0] + (g_cbGap / 4) - (g_clusterHeight / 2) - (g_barLabelHeight / 2))
			// No: don't use the gap (which is irrelevant here), but a "tweak" -- the difference
			// between the range origin and the bottom of the outline created
			// (in HScales.getBarLabelLeft) to get label dimensions
			vO = (tBars.points[i][0] - (g_clusterHeight / 2) - (g_barLabelHeight / 2) + g_barLabelTweak)
			labOrigin = Array(vO, g_barLabelLeft);
			addBarLabel(g_barLabGroup, g_catArray[i], labOrigin, i + 1);
		}

		// Blobs for this trace?
		if (!(myBlobs == undefined)) {
			if (g_blobHeadArray.length < 3) {
				// One set of blobs: reset blob box to cluster-depth, centred on cluster
				g_blobSize[1] = g_clusterHeight;
				yCentre = tBars.points[i][0] + ((g_clusterHeight / allT) * (tNo - 1)) - (g_clusterHeight / 2);
				//yCentre = (tBars.points[i][0] - (g_clusterHeight / 2));
				//yCentre = (tBars.points[i][0] - (tBars.points[i][3] / 2));
			}
			else {
				// Multiple blob sets: use y-centre of this bar
				yCentre = tBars.points[i][0] - (tBars.points[i][3] / 2);
				// And redefine individual blob depth
				g_blobSize[1] = (g_clusterHeight / allT);
			}
			// Immed above: condition on no. of blob-sets comm'd out
			// Draw blobs centre-aligned on "current" bar...
//			yCentre = (tBars.points[i][0] - (tBars.points[i][3] / 2));
			addBarBlob(yCentre, i + 1, myBlobs[i], (thisBar.left + thisBar.width));
		}
	}

	// Add key object to array...
	g_keyArray[tNo-1] = new keyObject(tNo, c_generalBarConst, tBars, 0, true);
	return g_barGroup;
}
// DRAW BARS ends

// BAR LABEL
// Called from drawBars, drawThermoBarTrace
// Draws bar label
function addBarLabel(lGrp, lString, lOrigin, n)
// Args are group; label string; anchor-point; point number
{
	var myLab;
	// Alignment
	var blAlign = c_lConst;
	if (!g_barLabelsAlignLeft) {blAlign = c_rConst};

	lString = trans_String(lString);
	myLab = makeText(lGrp, lOrigin,g_vScaleFontCMYK,
		g_vScaleFontName,g_vScaleFontSize,(g_vScaleFontSize - c_wrapLeadingMinus),blAlign,0,100,
		0, false ,lString, c_barLabN + n, c_barLabN + n, false);

}
// BAR LABEL ends

// DRAW THERMO BAR TRACE
// Called from Main.drawTrace to one trace for bar thermometers
function drawThermoBarTrace(pts, tNo, allT, toLeft, subStyle)
{
	// Initialise an array for a set of blob box values
	var myBlobs = undefined;
	var yCentre;		// centre vPos for blob box

	var tSpots = new tBarThermoObject(pts, tNo, allT, toLeft, subStyle)


	// Blobs for this trace?
	myBlobs = traceHasBlobs(tNo, allT)	// left undefined if no blobs (function in Utilities)
	if (!(myBlobs == undefined)) {
		// Set up a group
		g_blobGroup = g_panelLayer.groupItems.add();
		g_blobGroup.name = c_blobGroupN + tNo;
		// Blob headers(s) (in GenTraces)
		drawBlobHeads()
	}

	// Thermometers (ticks) drawn on first trace
	// Create group for labels
	if (tNo == 1) {
		drawBarThermoTicks(tSpots.points)
		// Labels group
		g_barLabGroup = g_traceLayer.groupItems.add();
		g_barLabGroup.name = c_barLabGroupN;
	}

	// Trace group
	g_barGroup = g_traceLayer.groupItems.add();
	g_barGroup.name = c_tbarGroupN + tNo;

	// tSpots.points is an array of (I hope!) x/y coords
	// Array to assemble x-coord of each point in this trace
	var xCoordArray = [];

	// Loop point by point...
	for (i = 0; i < tSpots.points.length; i ++) {
		// Call spot builder (with trace group; attributes; spot number; scatter flag)
		drawSpot(g_barGroup, tSpots, i, false)

		// Label -- on first trace only
		if (tNo == 1) {
			// Vertical position:
			vO = (tSpots.points[i][1] - (g_barLabelHeight / 2))
			labOrigin = Array(vO, g_barLabelLeft)
			addBarLabel(g_barLabGroup, g_catArray[i], labOrigin, i + 1);

			// Blobs?
			if (!(myBlobs == undefined)) {
				addBarBlob(tSpots.points[i][1], i + 1, myBlobs[i], (g_innerBox.left + g_innerBox.width));
			}
		}
		// Append x value to array
		xCoordArray.push(tSpots.points[i][0]);
	}
	// Append array of y-coords to global array
	g_thermoRawPointArray.push(xCoordArray);

	// Add key object to array... ---- CODE ENTERED 15.02.06 BUT NOT CHECKED
	// Modded Jan 2016: sending GENERAL scatter constant...
	g_keyArray[tNo-1] = new keyObject(tNo, c_scatterConst, tSpots);

	return g_barGroup
}
// DRAW THERMO BAR TRACE

// T-BARS OBJECT
// Called from drawBars
// Constructor for an object whose properties define the bars in one trace
function tBarsObject(ptArray, tNo, allT, subStyle)
// Args are: 	array of trace values
//				trace number
//				total number of traces
//				sub-style constant
{
	var i;					// counter
	var j = 0;				// counter
	var cBase;				// baseline
	var w;					// width value
	// Trace attributes loop after a certain point...
	var tStyleNo = tNo;
	while (tStyleNo > c_traceLoopNo) {tStyleNo -= c_traceLoopNo};

	// But if this is first trace of only one, check the "use style 2 for one trace" flag
	if ((tStyleNo == 1) && (allT == 1)) {
		if (g_oneBarColUsesStyleTwo) {tStyleNo = 2};
	}

	var bsAllow = 0;		// broken scale margin width (none by default)
	if ((g_isBS[0]) || (g_isBS[1])) {bsAllow += g_brokenScaleMargin};

	// Baseline defaults to left of inner box (may be overwritten by zero line, see below)
	var cBase = (g_innerBox.left - bsAllow);

	// Four co-ord arrays:
	var tArray = new Array(ptArray.length);			// tops
	var lArray = new Array(ptArray.length);			// lefts
	var wArray = new Array(ptArray.length);			// width(s)
	var hArray = new Array(ptArray.length);			// heights
	// The final array will have point_number elements, each consisting of
	// a 4-slot array defining each bar's top, left, width & height
	var cTraceArray = new Array(ptArray.length);	//

	var accum = (g_accumulate[0] || g_accumulate[1]);

	// Identifier for stacked/unstacked fill set:
	var barStyleInsert;

	// Tops
	tArray = barTArray(ptArray.length, tNo, allT, subStyle);
	// barTArray also calc'd height and assigned to global (picked up below)

	// Widths:
	for (i in ptArray) {
		if (g_dataAExists) {
			w = calcXValuePos(ptArray[i], true);
		}
		else {
			w = calcXValuePos(ptArray[i], false);
		}
		// If value was skipped, set width to zero
		if (w === undefined) {
			wArray[i] = 0;
		}
		else {
			wArray[i] = w;		// was:(w - lArray[i]); -- but we don't have lArray[i] yet...
		}
	}

	// Lefts
	// Default baseline (set above) is left of inner box. HOWEVER...
	// ...if scale goes below zero, use zero line
	if ((!(g_lowA == undefined) && (g_lowA < 0)) ||
		(!(g_lowB == undefined) && (g_lowB < 0))) {
		cBase = g_cbBase[0];
	}
	// Bar lefts and widths
	if ((accum) || (subStyle == c_barStackedConst)) {
		// 2013 version
		for (i in ptArray) {
			if (ptArray.hasOwnProperty(i)) {
				// Set defaults on first loop:
				if (tNo == 1) {
					g_prevTopsArray[i] = cBase;
					g_prevBottomsArray[i] = cBase;
				}
				// Are vals +/- ?
				if (ptArray[i] >= 0) {
					// Bar left is prev:
					lArray[i] = g_prevTopsArray[i];
					// Bar width is always unaccum’d pos - base
					wArray[i] = wArray[i] - cBase;
					// And remember:
					g_prevTopsArray[i] = lArray[i] + wArray[i];
				}
				else {
					// Neg vals: same but upside down
					wArray[i] = cBase - wArray[i];
					lArray[i] = g_prevBottomsArray[i] - wArray[i];
					g_prevBottomsArray[i] = lArray[i];
				}
			}
		}
		// Identifier for stacked fill set:
		barStyleInsert = 'Stacked';
		// Accum'd options end
	}
	else {
		// Non-accum -- always use baseline
		for (i in ptArray) {
			lArray[i] = cBase;
			if (wArray[i] !== 0) {wArray[i] -=cBase;}
		}
		// Identifier for stacked fill set:
		barStyleInsert = 'Unstacked';
	}

	// Heights -- same for all
	for (i = 0; i < hArray.length; i ++) {
		hArray[i] = g_barHeight;
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
	// Fill is forced for bars
	this.fFlag = true;
	// 'Insert' refers us to un/stacked style attributes in section LU
	// Condition for REVAMP
	if (g_isRevamp) {
		eval("this.fCol = g_tCB" + barStyleInsert + tStyleNo + "FillCMYK");
	}
	else {
		eval("this.fCol = g_tCB" + tStyleNo + "FillCMYK");
	}
	// Stroke
	this.sFlag = g_hasBarStroke;
	eval("this.sWidth = g_tCB" + tStyleNo + "StrokeWidth");
	eval("this.sCol = g_tCB" + tStyleNo + "StrokeCMYK");
	// Other
	this.lineEnd = c_defaultLineEnd;
	this.lineMiter = c_defaultLineMiter;
	this.miterLimit = c_defaultLineMiterLimit;
	this.name = c_tBarN + tNo;
	this.note = this.name;
}
// T_BARS OBJECT ends


// T-BAR THERMO OBJECT
// Creates thermometer-trace defining object
function tBarThermoObject(ptArray, tNo, allT, subStyle)
// Args are: 	array of trace values
//				trace number
//				total number of traces
//				sub-style constant
{
	var i;					// counter
	var j = 0;				// counter
	// Trace attributes loop after a certain point...
	var tStyleNo = tNo;
	if (tStyleNo > c_traceLoopNo) {tStyleNo -= c_traceLoopNo};

	// But if this is first trace of only one, check the "use style 2 for one trace" flag
	if ((tStyleNo == 1) && (allT == 1)) {
		if (g_oneBarColUsesStyleTwo) {tStyleNo = 2};
	}

	var bsAllow = 0;		// broken scale margin width (none by default)
	if ((g_isBS[0]) || (g_isBS[1])) {bsAllow += g_brokenScaleMargin};

	// Baseline defaults to left of inner box (may be overwritten by zero line, see below)
	var cBase = (g_innerBox.left - bsAllow);

	// Two co-ord arrays:
	var xArray = new Array(ptArray.length);			// horizontal centres
	var yArray = new Array(ptArray.length);			// vertical centres
	// The final array will have point_number elements, each consisting of
	// a 4-slot array defining each bar's top, left, width & height
	var bTraceArray = new Array(ptArray.length);


	// Vertical positions
	yArray = barTArray(ptArray.length, tNo, allT, subStyle);

	// Horizontal positions
	for (i in ptArray) {
		if (g_dataAExists) {xArray[i] = calcXValuePos(ptArray[i], true)};
		else {xArray[i] = calcXValuePos(ptArray[i], false)};
	}

	// Combine arrays
	for (i = 0; i < ptArray.length; i ++) {
		// If there is a skipped value ("*"), don't pass to
		// combined array, which is shortened by 1 element
		if (yArray[i] == undefined) {
			bTraceArray.pop();
		}
		else {
			// Combined array uses separate counter to allow for skipped values
			bTraceArray[j] = Array(xArray[i],yArray[i]);
			j ++;
		}
	}
	this.points=bTraceArray;

	// OTHER ATTRIBUTES
	// Revamp introduced the 'crossbar' thermomenter option...
	if (g_thermoCross) {
		// In response to prompt (which is only seen on thermometers)
		// user asked for 'crossbar'
		this.shape = 2;
	}
	else {
		// Otherwise use option set in section lookup (circle or diamond)
		this.shape = g_tScatterShape;
	}
	this.size = g_tScatterSize;
	// Stroke and fill
	this.fFlag = g_tScatterFillFlag;
	// Yes, I know eval is evil. For revamp use specific
	// thermo properties. For old use scatter styles
	if (g_isRevamp) {
		this.sFlag = g_tCBThermoStrokeFlag;
		var styleStr = 'g_tCBThermo';
	}
	else {
		this.sFlag = g_tScatterStrokeFlag;
		styleStr = 'g_tScatter';
	}
	eval("this.fCol = " + styleStr + tStyleNo + "FillCMYK");
	eval("this.sWidth = " + styleStr + tStyleNo + "StrokeWidth");
	eval("this.sCol = " + styleStr + tStyleNo + "StrokeCMYK");

	// Other
	this.lineEnd = c_defaultLineEnd;
	this.lineMiter = c_defaultLineMiter;
	this.miterLimit = c_defaultLineMiterLimit;
	this.name = "to come ";
	this.note = this.name;
	// REVAMP flag for orientation of thermo crossbars
	this.isBar = true;
}
// T-BAR THERMO OBJECT ends




// BAR T-ARRAY
// Called from tBarsObject to return top coords for ALL bars in trace
// ALSO assigns height to a global, g_barHeight (strictly speading, I should do this just
// once, since all traces use same bar height. But structurally makes more sense here...
function barTArray(pNo, thisT, total, style)
// Args	number of points
//		trace number (from 1)
// 		total number of traces
//		sub-style constant
{
	var i;						// counter
	var myDepth;					// inner box depth
	var xpArray = Array(pNo);		// array to return
	var xMove;					// slotwidth
	var thisP;					// decrementing tops of bars

	// Calculate height of each bar
	myDepth = g_innerBox.height;			// total depth
	myDepth -= (g_cbGap * (pNo - 1));		// subtract all gap-heights
	g_clusterHeight = myDepth / (pNo);		// individual cluster height (used to calc label position)

	// If bars are squeezed tight and narrow, label depth can exceed cluster depth, causing last label
	// to project at bottom of chart. If so, ON TRACE 1 ONLY, tweak inner box depth and RECALCULATE...
	// (Label depth is in g_barLabelHeight)
	if (thisT == 1) {
		if (g_barLabelHeight > g_clusterHeight) {
			g_innerBox.height -= ((g_barLabelHeight - g_clusterHeight));
			myDepth = g_innerBox.height;
			myDepth -= (g_cbGap * (pNo - 1));
			g_clusterHeight = myDepth / (pNo);
		}
	}

	xMove = g_clusterHeight + g_cbGap;	// x-distance between cluster tops
	thisP = g_innerBox.top;				// initial position is top of first slot

	// Style (stack, overlap...) determines individual bar height
	if (total == 1) {
		// Only 1 trace -- just lose the gap;
		g_barHeight = xMove - g_cbGap
		// thisP -= (g_barHeight/2)
	}
	else if ((style == c_barThermoConst)) {
		// Thermometer -- use centre
		thisP -= (g_clusterHeight/2)
		// Width remains undefined
	}
	else {
		switch (style) {
			case c_barSideBySideConst:			// Sidebyside --
				g_barHeight = ((xMove - g_cbGap) / total)
				// thisP -= ((xMove - g_cbGap) / 2)
				thisP -= (g_barHeight * (thisT - 1));
				break;
			case c_barStackedConst:				// Stacked -- just lose the gap
				g_barHeight = xMove - g_cbGap
				// thisP -= (g_barHeight / 2)
				break;
			case c_barOverlapConst:				// Overlap --
				g_barHeight = ((xMove - g_cbGap) / (total + 1) * 2)
				// thisP -= ((xMove - g_cbGap) / 2)
				thisP -= (g_barHeight / 2) * (thisT - 1)
				break;
		}
	}
	// Create array of tops
	for (i = 0; i < pNo; i ++) {
		xpArray[i] = thisP;
		thisP -= xMove;
	}
	return xpArray;
}
// BAR T-ARRAY ends


// ADD BAR BLOB
// Draws individual blob box
function addBarBlob(bC, bNo, bString, bRight)
// Args are		vertical centre
//				point number (for item ID)
//				string
//				current bar right
{
	var bG;
	var bBox;
	var bRange;
	var bPts = Array(3);
	var sPts = Array(1);
	var bCentre = Array(1);
	// Group for this box and string:
	bG = g_blobGroup.groupItems.add();
	bG.name = c_blobN + bNo;

	// Skipped/missing value
	if ((bString == c_skipConst) || (bString == undefined)) {bString = c_naConst};

	// Box
	// Get centre point
	// X-pos depends on whether blobs "hug" the bar or not...
	if (g_blobHugBars == undefined) {
		// blobs stacked and aligned at right
		bCentre[0] = g_blobSize[2];
	}
	else {
		// hug end of bar
		bCentre[0] = bRight + g_blobHugBars + g_blobSize[0] / 2;
	}
	bCentre[1] = bC;													// y
	bPts[0] = bCentre[1] + (g_blobSize[1] / 2);	// top
	bPts[1] = bCentre[0] - (g_blobSize[0] / 2);	// left (yes, I know there's redundancy here...)
	bPts[2] = g_blobSize[0];						// width
	bPts[3] = g_blobSize[1];						// height
	// Draw box
	bBox = makeRect(bG, bPts, g_blobBoxFillFlag, g_blobBoxFillCMYK,
		g_blobBoxStrokeFlag, g_blobBoxStrokeWidth, g_blobBoxStrokeCMYK,
		bG.name, bG.name);

	// String (centre aligned) -- I want x,y
	sPts[1] = bCentre[0];
	// REVAMP: width/height array from lookup:
	sPts[0] = bPts[0] - bPts[3] + g_blobBoxMargin[1]; // top - height + margin
	bRange = makeText(bG, sPts, g_blobFontCMYK,
		g_blobFontName, g_blobFontSize, g_blobFontSize, c_cConst, 0, 100,
		0, false ,bString, bG.name, bG.name, false);
	// Centre text vertically
	vCentreTextOn(bRange,bBox);
}
// ADD BAR BLOB



// DRAW BAR THERMO TICKS
// Called from drawThermoBarTrace
// Controls drawing set of ticks for bar thermometer
function drawBarThermoTicks(drawPts)
// Arg is the array of origins, from which I extract vertical positions
{
	var i;
	var graphicStyle;
	var tPoints;
	var vPos;
	var tCount = 1;	// counter value appended to tick name/note
	// Create group
	g_vScaleTickGroup = g_panelLayer.groupItems.add();
	g_vScaleTickGroup.name = c_thermoGroupN;

	// Graphic styles: back and front
	try {
		graphicStyleBack = g_myDoc.graphicStyles[c_thermoBack];
	}
	catch (err) {graphicStyleBack = undefined};
	try {
		graphicStyleFront = g_myDoc.graphicStyles[c_thermoFront];
	}
	catch (err) {graphicStyleFront = undefined};

	// Loop by points
	for (i = 0; i < drawPts.length; i++) {
		vPos = drawPts[i][1];
		tPoints = Array(Array(g_innerBox.left, vPos),Array(g_innerBox.left + g_innerBox.width, vPos))
		// Draw lines. Fourth param is the group to append to...
		// ...and fifth is a new flag, false for back, true for front...
		makeThermoTick(tPoints, tCount, graphicStyleBack, g_hScaleTickGroup, false);
		makeThermoTick(tPoints, tCount, graphicStyleFront, g_hScaleTickGroup, true);
		tCount++;

	}

}
// DRAW BAR THERMO TICKS ends
