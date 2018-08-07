/*	Component contains inferential code for LD charts only
		Added for REVAMP, March 2016...
*/

function doLeaderStuff() {
	// Set up context: same as for non-Leaders
	g_hScaleStringGroup = g_panelLayer.groupItems.add();
	g_hScaleStringGroup.name = c_hScaleStringGroupN;
	g_hScaleTickGroup = g_panelLayer.groupItems.add();
	g_hScaleTickGroup.name = c_hScaleTickGroupN;
	// (duplicates code in HScales)
	// Fake up:
	var bVal = g_innerBox.top - g_innerBox.height + g_hScaleMainSpaceAbove;
	g_cbBase = [bVal,bVal];
	// Strings
	if (!drawLeaderHScaleLabels(g_hScaleStringGroup)) {
		return false;
	}
	// Tweak inner box:
	g_innerBox.height -= g_hScaleMainSpaceAbove;
	// Baseline
	if (!drawLeaderBaseline(g_hScaleTickGroup)) {
		return false;
	}
	prepareFakeBlobs();
	return true;
}

// DRAW LEADER H-SCALE LABELS
// Pretty much a dupe of Background > drawDoubleSCaleDummyText
function drawLeaderHScaleLabels(context) {
	// Left:
	var anchor = [(g_innerBox.top - g_innerBox.height), g_innerBox.left];
	var str = g_catArray[0];
	var name = 'Left leader hscale label';
	var tWidth = g_innerBox.width/2;
	var leftLab = makeText(context, anchor,
		g_hScaleFontCMYK, g_hScaleFontName,
		g_hScaleMainFontSize, g_hScaleMainFontSize,
		g_sourceAlign, 0, 100, tWidth, false, str, name, name, true);
	// Right:
	anchor[1] += g_innerBox.width;
	str = g_catArray[g_catArray.length - 1];
	name = 'Rightleader hscale label';
	var rightLab = makeText(context, anchor,
		g_hScaleFontCMYK, g_hScaleFontName,
		g_hScaleMainFontSize, g_hScaleMainFontSize,
		g_footnoteAlign, 0, 100, tWidth, false, str, name, name, true);
	return true
}

// DRAW LEADER BASELINE
// Draws a baseline along bottom of inner box
function drawLeaderBaseline(context) {
	var pts = [];
	var n =
	pts.push([g_innerBox.left, g_innerBox.top - g_innerBox.height]);
	pts.push([g_innerBox.left + g_innerBox.width, g_innerBox.top - g_innerBox.height]);
	g_baselineTick = makeLine(context, pts, false, undefined,
		true, g_vScaleBaseStrokeWidth, g_vScaleBaseCMYK,
		0, c_defaultLineMiter, c_defaultLineMiterLimit, c_vScaleTickN, c_vScaleTickN, undefined);
	return true;
}


function prepareFakeBlobs() {
	// Don't I just need to set up an array of fake blobs?
	g_blobFlag = true;
	// Set up a fake g_blobArray
	g_blobArray = [];
	// Array of category strings and values
	var cats = g_catArray;
	var pts = g_valArray[0];
	var tempA = [];
	var tempB = [];
	for (i = 0; i < cats.length; i ++) {
		if ((i === 0) || (i === (cats.length - 1))) {
			tempA.push(cats[i]);
			tempB.push(pts[i]);
		}
		else {
			tempA.push('*');
			tempB.push('*');
		}
	}
	g_blobArray.push(tempA);
	g_blobArray.push(tempB);
	// More faking up, so that Columns > addColBlob has everything it needs to make sense of this
	g_blobHugCols = undefined;
	// Blob size is arbitrary
	g_blobSize = [15, 8, (g_innerBox.top - 10)];
	g_blobHeadArray = [];

}
