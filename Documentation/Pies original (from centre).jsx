﻿/* Pies and half-piesCreated 12.01.06Updated 02.12.08 (donut overprint bugfix)- drawPies	Controls construction of one (half-) pie- setWedgeAttributes- getPieCentres	Calculates centre points for all (half-) pies in panel- calcPoint	Calculates pathPoint origin- calcLeftDP	Calculates coords for pathPoint left direction point- calcRightDP	Calculates coords for pathPoint right direction point*/// DRAW PIES// Called from Main.drawTraces to control creation of ONE trace// in a Pie or Half-pie chartfunction drawPie(valArray,tNo,tCount,fullPie,isNested)// Args:		array of values//			trace number (from 1)//			total number of traces//			true=pie; false=halfpie//			true=nested (half-pies only){	var w;								// wedge attributes object	var centre;							// centre coords	var wedgeCount = valArray.length;		// number of wedges	var wedgeNo;							// wedge counter	var valTotal = 0;						// sum of values	var wedge;							// wedge object	var ppt;								// current path point	var pptOrigin;						// and its anchor	var segmentAngle;						// angle of current wedge segment (in radians)	var pieAngle;							// incrementing angle of rotation	var donut;							// pie hole (if any)	var dSize;							// donut ht/w'th	var dCMYK;							// and fill	var pLab;							// Pie (trace) label string...	var p;								// ...and object	var pieTurn = 0;						// rotation adjustment for full pies	// Holder for radius of the imaginary circle on which direction points will lie	// if wedge segment < 90-degrees (90-degree setting is below)	var dpRad;	// Cumulative rotation of all wedges (in radians --	// starts at noon for complete pies...	var pieAngle = 0;	// ... 9 o'clock for half-pies	if (!fullPie) {pieAngle = 270};	// Trace group	var pieGroup = g_traceLayer.groupItems.add();	pieGroup.name = c_tPieGroupN + tNo;	// Centre coords	centre = g_pieCentres[tNo -1]	// g_pieRadius holds radius	// Sum values (omitting skipped)	for (wedgeNo = 0; wedgeNo < wedgeCount; wedgeNo ++) {		if (!(valArray[wedgeNo] == c_skipConst)) {			valTotal += valArray[wedgeNo];		}	}	// Reinitialise key array (Main.drawTraces sets its length to the number of traces;	// but pies reset to number of wedges (I'll draw one key box with wedge name; then add values	// for additional traces...	if (tNo == 1) {		g_keyArray = Array(wedgeCount);	}	// Loop by wedges	for (wedgeNo = 0; wedgeNo < wedgeCount; wedgeNo ++) {		// Skip blanks		if ((valArray[wedgeNo] == c_skipConst) ||			(valArray[wedgeNo] == 0)) {			wedge = undefined;		}		else {			// There is a wedge...			// Angle in radians, as proportion of complete circle			// segmentAngle = (2 * Math.PI) * (valArray[wedgeNo] / valTotal);			// Now in degrees			segmentAngle = 360 * (valArray[wedgeNo] / valTotal)			// If this is a full pie, on the first wedge			// reserve its angle so that the entire pie			// can be rotated to bring end of first wedge			// counter-clockwise to 12 o'clock			if (fullPie && (wedgeNo == 0)) {				pieTurn = segmentAngle;				// pieTurn = (valArray[wedgeNo] / valTotal) * 360;			}			// Half-pie?			if (!fullPie) {segmentAngle = (segmentAngle / 2)};			// Set attributes			w = new tWedgeObject(tNo, wedgeNo + 1);			// context, centre, angle 1, internal angle, clockwise, radius,			//		fill/stroke/mitering/ID/dash			wedge = makeWedge(pieGroup,centre, pieAngle, segmentAngle, true, g_pieRadius,				w.fFlag, w.fCol, w.sFlag, w.sWidth, w.sCol,				w.lineEnd, w.lineMiter, w.miterLimit, w.name, w.note,				w.Dash)			// SNIPPED FROM HERE			// Code is in "Pie code deleted May 07.jsx" in documentation folder			pieAngle += segmentAngle;		}		// Define key attributes for this point (whether a wedge was actually drawn or not)		if (tNo == 1) {			// If the "wedge" is undefined (ie asterisk) on this trace, set it as undefined			// otherwise create a key object			if (valArray[wedgeNo] == "*") {				g_keyArray[wedgeNo] = undefined;			}			else {				g_keyArray[wedgeNo] = new keyObject(wedgeNo + 1, c_generalPieConst, w, valArray[wedgeNo], true);			}		}		else {			// On subsequent loops, if the relevant key object was undefined after previous traces,			// initialise now; otherwise append trace detail to string...			if (g_keyArray[wedgeNo] == undefined) {				g_keyArray[wedgeNo] = new keyObject(wedgeNo + 1, c_generalPieConst, w, valArray[wedgeNo], true);			}			else {				g_keyArray[wedgeNo].ktString += ("; " + valArray[wedgeNo]);			}		}	}	// Donut:	// (unless size set to zero)	if (g_pieDonutPercent > 0) {		// Fill depends on whether drawn on background or panel		if (g_totalPanelNo == 1) {dCMYK = g_pieDonutFillCMYK};		else {dCMYK = g_panelFillCMYK};		// Full pie:		if (fullPie) {			dSize = g_pieRadius / 50 * g_pieDonutPercent			donut = makeEllipse(pieGroup, centre, dSize, dSize,				true, dCMYK,				false, undefined, undefined,				"Donut " + tNo, "Donut " + tNo);		}		// Half pie		else {			// Nested?			if (isNested) {dSize = (g_pieRadius / 100) * (70 / tNo)};			else {dSize = g_pieRadius / 100 * g_pieDonutPercent};			// Half-pie donuts are stroked to cover pie base			donut = makeWedge(pieGroup, centre, 270, 180, true, dSize,				true, dCMYK, true, 0.5, dCMYK,				w.lineEnd, w.lineMiter, w.miterLimit, "Donut", "Donut",				undefined)		}		// Inferential mod April 08 sets donut overprint off:		donut.fillOverprint = false;		donut.strokeOverprint = false;	}	// Pie (trace) label at centre	pLab = g_headArray[tNo - 1];	if (!(pLab == undefined)) {		pLab = trans_String(pLab);		p = makeText(g_panelLayer, centre.reverse(),			g_keyFontCMYK,g_keyFontName, g_keyFontSize, g_keyFontLeading,			c_cConst, 0, 100, 0, false,			pLab, "Label " + wedgeNo, "Label " + wedgeNo);	}	// Wedge loop ends	// Rotate full pie counterclockwise to bring first wedge to top left	// It's revolving around the centre by default...	var remPos = Array(pieGroup.left, pieGroup.top);	pieGroup.rotate(pieTurn);	pieGroup.left = remPos[0];	pieGroup.top = remPos[1];	// ...since I can't quite the next to work:	// pieGroup.rotate(pieTurn,false,false,false,false,rotateAbout = Transformation.CENTER)	// (And, as you can see, I have to correct anyway, since it isn't quite on the nose!)	// Nested pies: halve radius before next loop...	if (isNested) {g_pieRadius = (g_pieRadius / 2)};	return pieGroup;}// DRAW PIE ends// Wedge object constructorfunction tWedgeObject(tN, wN)// Args are:		trace no.//				wedge no.{	// Wedge styles loop after a certain point...	var wStyleNo = wN;	while (wStyleNo > c_traceLoopNo) {wStyleNo -= c_traceLoopNo};	this.fFlag = true;	eval("this.fCol = g_wedge" + wStyleNo + "FillCMYK");	this.sFlag = g_pieStrokeFlag;	this.sWidth = g_pieStrokeWidth;	this.sCol = g_pieStrokeCMYK;	// Wedge strokes have round end/miter to prevent spikes	// (FT requirement hard-coded)	this.lineEnd = 2		//c_defaultLineEnd;	this.lineMiter = 2;	//c_defaultLineMiter;	this.miterLimit = c_defaultLineMiterLimit;	this.name = c_tPieN + tN + "." + wN;	this.note = c_tPieN + tN + "." + wN;	this.dash = undefined;}// GET PIE CENTRES// Called from Main.drawTraces to generate an array of (half-) pie centre// positions within the inner box. Also assigns pie chart radius// to a globalfunction getPieCentres(pieCount, isHalf, isNested)// Arg:	number of pies (from 1)//		true if half-pie//		true if nested half-pie{	var centresArray = Array(pieCount);		// array to return	var ibT = g_innerBox.top;				// inner box top...	var ibL = g_innerBox.left;				// ...left...	var ibH = g_innerBox.height;			// ...height...	var ibW = g_innerBox.width;				// ...width...	var i;									// counter	var isTaller = false;					// set to true if IB = taller than it is wide:--	if (isHalf) {		// Somewhat arbitrary rule for stacking half pies		if (ibH > (ibW * 0.7)) {isTaller = true};	}	else {		if (ibH > ibW) {isTaller = true};	}	// Arrangement determined by number of pies and shape of inner box	// So far, I treat half-pies the same as full pies	if (isHalf && isNested) {		// Nested halfpies use same centre...		for (i = 0; i < pieCount; i++) {			centresArray[i] = Array(ibL + (ibW / 2), ibT - (ibH / 2));		}		// ...and start with radius:--		if (isTaller) {g_pieRadius = ibW * g_pieProportion / 2};		else {g_pieRadius = ibH * g_pieProportion / 2};	}	else if (pieCount == 1) {	// One pie: dead centre		centresArray[0] = Array(ibL + (ibW / 2), ibT - (ibH / 2));		// Radius		if (isTaller) {g_pieRadius = ibW * g_pieProportion / 2};		else {g_pieRadius = ibH * g_pieProportion / 2};	}	else if (pieCount < 4) {	// Two or three: vertical or horizontal		if (isTaller) {			// Stack vertically			for (i = 0; i < pieCount; i++) {				centresArray[i] = Array (					ibL + (ibW / 2),					ibT - (ibH / pieCount * (i + 1)) + (ibH / (pieCount * 2)) );			}		// Radius			g_pieRadius = ibH * g_pieProportion / (pieCount * 2);		}		else {			// Stack horizontally			for (i = 0; i < pieCount; i++) {				centresArray[i] = Array (					ibL + (ibW / pieCount * (i + 1)) - (ibW / (pieCount * 2)),					ibT - (ibH / 2)	);			}			// Radius			g_pieRadius = ibW * g_pieProportion / (pieCount * 2);		}	}	else if (pieCount == 4) {	// Four: divide IB into quarters; draw by rows		// Top left		centresArray[0] = Array(ibL + (ibW / 4), ibT - (ibH / 4));		// Top right		centresArray[1] = Array(ibL + (ibW * 0.75), ibT - (ibH / 4));		// Bottom left		centresArray[2] = Array(ibL + (ibW / 4), ibT - (ibH * 0.75));		// Bottom right		centresArray[3] = Array(ibL + (ibW * 0.75), ibT - (ibH * 0.75));		// Radius		if (isTaller) {g_pieRadius = ibW * g_pieProportion / 4};		else {g_pieRadius = ibH * g_pieProportion / 4};	}	return centresArray;}// GET PIE CENTRES ends// *** Point-calculators ***// CALC POINT// Called from drawPie to calculate pathPoint origin (returns Array)function calcPoint(wCentre, wRadius, wAngle, counterClock)// Args:	center co-ords//			wedge radius//			angle of point//			true = complete pies, which are drawn counter-clockwise//				false = half-pie{	var x;	var y;	// counterClock is true for full pies; false (so clockwise rotation) for half	// Previously forced full pies clockwise with:--	// counterClock = false;	if (counterClock) {		x = wCentre[0] - (wRadius * Math.sin(wAngle));	}	else {		x = wCentre[0] + (wRadius * Math.sin(wAngle));	}	y = wCentre[1] + (wRadius * Math.cos(wAngle));	return Array(x,y)}// CALC POINT ends// CALC LEFT-DP// Called from drawPie to calculate "left" (incoming) direction point coordinates (returns Array)function calcLeftDP(wCentre, dpRad, overallA, currentA, counterClock){	var x;	var y;	// counterClock is true for full pies; false (so clockwise rotation) for half	// Previously forced full pies clockwise with:--	// counterClock = false;	if (counterClock) {		x = wCentre[0] - (dpRad * Math.sin(overallA - (currentA / c_dpConst)));	}	else {		x = wCentre[0] + (dpRad * Math.sin(overallA - (currentA / c_dpConst)));	}	y = wCentre[1] + (dpRad * Math.cos(overallA - (currentA / c_dpConst)));	return Array(x,y);}// CALC LEFT-DP ends// CALC RIGHT-DP// Called from drawPie to calculate "right" (outgoing) direction point coordinates (returns Array)function calcRightDP(wCentre, dpRad, overallA, currentA, counterClock){	var x;	var y;	// counterClock is true for full pies; false (so clockwise rotation) for half	// Previously forced full pies clockwise with:--	// counterClock = false;	if (counterClock) {		x = wCentre[0] - (dpRad * Math.sin(overallA + (currentA / c_dpConst)));	}	else {		x = wCentre[0] + (dpRad * Math.sin(overallA + (currentA / c_dpConst)));	}	y = wCentre[1] + (dpRad * Math.cos(overallA + (currentA / c_dpConst)));	return Array (x,y);}// CALC RIGHT-DP ends