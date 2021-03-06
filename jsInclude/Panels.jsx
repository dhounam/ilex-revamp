/*
Created 18.11.05
Updated 30.01.17 (revamp drawPanelHeader)

All panel creation and recognition procedures

- Section 1		creation
	drawPanels
		Draws 1 or more panels from scratch
		Calls:
			doActualPanels	to draw actual panels
			doHPanels
			doVPanels



- Section 2		recognition
	matchSlot
	preparePanels

	checkReadyPanel

	Added at bottom:
	drawPanelHeader

*/

// $.level=1;


// *** SECTION 1: CREATION ***
// 3 functions create panels from scratch

// DRAW PANELS
// Draws one or more panels from scratch
// Called from Background.drawBackground
function drawPanels(bbG, hasOverallSubtitle)
// Arg is background group
// + true if we need space for an overall subtitle above the panel array
{
	var gutterNo;		// gutter counter
	var gutterTotal;	// Cumulative width of ALL gutters
	var thisP;		// Refers to current panel
	var pLeft;		// Left co-ord of current panel
	var thisP;		// temporary holder
	var itemName;
	var itemNote;
	var oldPos;		// original IB position

	// KLUDGE, Aug 2018, REVAMP only
	// If it's a 1-col chart (let's say, width arbitrarily < 250pts), set narrow gutter width
	if (g_isRevamp && (g_chartWidth < 250)) {
		g_gutterWidth = g_gutterWidthOneCol;
	}

	// Redraw inner box to distance below title
	oldPos = g_innerBox.top
	// If there is no global subtitle, this is the
	// correct gap: 15pts
	g_innerBox.top = g_titleRange.anchor[1] - g_panelSpaceAbove;
	g_innerBox.height += (g_innerBox.top - oldPos);

	// Tweak again if there's an overall subtitle...
	// Another 10pts
	if (hasOverallSubtitle) {
		g_innerBox.top -= g_gapBetweenOverallSubtitleAndPanel;
		g_innerBox.height -= g_gapBetweenOverallSubtitleAndPanel;
	}

	// Calculate panel width/height (if applicable)
	if (g_totalPanelNo == 1) {
		// Only one panel?
		// Create layer for contents:
		g_panelLayer = g_myDoc.layers.add();
		g_panelLayer.name = c_onePanelLayerN;
		setLayerColor(g_panelLayer,c_panelColors[0]);
		// If single panel is invisible, bale out now
		if (!g_onePanelVisible) {return true};
		// Still here? Set width/height for single visible panel
		g_panelWidth = g_innerBox.width;
		g_panelHeight = g_innerBox.height;
	}
	else {
		// For multi-panels, I work out width and depth of each panel here
		// height (uses no. of rows)
		gutterNo = g_panelRowNo - 1;
		gutterTotal = gutterNo * g_gutterHeight;
		g_panelHeight = ((g_innerBox.height - gutterTotal) / g_panelRowNo);
		// width (no. of cols = total/rows)
		gutterNo = (g_totalPanelNo / g_panelRowNo) - 1;
		gutterTotal = gutterNo * g_gutterWidth;
		g_panelWidth = ((g_innerBox.width - gutterTotal) / (g_totalPanelNo / g_panelRowNo));
	}

	if (g_totalPanelNo == 1) {
		if (g_onePanelVisible) {
			if (!doActualPanels(bbG)) {return false};
		}
	}

	else {
		if (!doActualPanels(bbG)) {return false};
	}
	return true
}
// DRAW PANELS ends


// DO ACTUAL_PANELS
// Called from drawPanels to draw actual array of panels
function doActualPanels(context)
// Arg is layer/group where panels are drawn
{
	var pTop = g_innerBox.top;			// moveable panel top...
	var pLeft = g_innerBox.left;		// ...and left 		(since i reset the inner box on the fly the active panel...)
	var myLeft;						// left position 		(...I need an original left to reset on each row)
	var itemPoints = new Array(4);		// rect. t/l/w/h
	var cNo;							// col counter
	var rNo;							// row counter
	var i = 1;						// panel number counter
	var itemName;
	var itemNote;
	var thisP;
	var pColNo;
	// Number of columns
	var colTotal = g_totalPanelNo / g_panelRowNo;
	var divider;
	var dividerPoints;
	// Margin of divider within gutter
	var dividerMargin;

	// Set width and height, which don't change:
	itemPoints[2] = g_panelWidth;
	itemPoints[3] = g_panelHeight;

	// Outer loop by rows
	for (rNo = 0; rNo < g_panelRowNo; rNo ++) {
		// Start each row at original far left
		myLeft  = pLeft;

		// Inner loop by columns -- start at chart left
		for (cNo = 0; cNo < colTotal; cNo ++) {
			// Set current top & left, plus other attributes:
			itemPoints[0] = pTop;
			itemPoints[1] = myLeft;
			itemName = c_panelN + i;
			itemNote = c_panelN + i;

			// This draws the panel
			thisP = makeRect(context, itemPoints, g_panelFillFlag, g_panelFillCMYK,
				g_panelStrokeFlag, g_panelStrokeWidth, g_panelStrokeCMYK, itemName, itemNote);

			// Only REVAMP has dividers:
			// Modded Sep 2016: dividerExists flag prevents divider being drawn
			// (red panel flashes are drawn with panel text elements in Background.jsx)
			if (g_isRevamp && g_dividerExists) {
				// So to draw the 'gutter' dividers:
				// v.1 does a divider for each individual panel, leaving holes at intersections
				// if (rNo < (g_panelRowNo - 1)) {
				// 	alert('Draw gutter divider below panel ' + (cNo + 1) + ' of row ' + (rNo + 1));
				// }
				// if (cNo < (colTotal - 1)) {
				// 	alert('Draw gutter divider to right of panel ' + (cNo + 1) + ' of row ' + (rNo + 1));
				// }
				// So for 'complete' dividers, we need...
				dividerMargin = (g_gutterWidth - g_dividerWidth) / 2;
				if (rNo < (g_panelRowNo - 1)) {
					if (cNo === 0) {
						// alert('Draw divider right across chart below row ' + (rNo + 1));
						var divTop = g_innerBox.top - (g_panelHeight * (rNo + 1));
						divTop -= dividerMargin;
						dividerPoints = [
							divTop,
							g_innerBox.left,
							g_innerBox.width,
							g_dividerWidth
						];
						makeRect(context, dividerPoints, g_dividerFillFlag, g_dividerFillCMYK,
							g_panelStrokeFlag, g_panelStrokeWidth, g_panelStrokeCMYK, 'Row divider', ' Row divider');
					}
				}
				if (cNo < (colTotal - 1)) {
					if (rNo === 0) {
						// alert('Draw divider right down chart to right of column ' + (cNo + 1));
						var divLeft = g_innerBox.left + (g_panelWidth * (cNo + 1));
						divLeft += dividerMargin;
						dividerPoints = [
							g_innerBox.top,
							divLeft,
							g_dividerWidth,
							g_innerBox.height
						];
						makeRect(context, dividerPoints, g_dividerFillFlag, g_dividerFillCMYK,
							g_panelStrokeFlag, g_panelStrokeWidth, g_panelStrokeCMYK, 'Col divider', 'Col divider');
					}
				}
			}

			// If panel was created...
			if (!(thisP == undefined)) {
				thisP.moveToBeginning(context);
				// Assign panel object to global for future reference
				eval("g_Panel" + i + " = thisP");
				// Redraw inner box to active panel:
				if (i == g_thisPanelNo) {
					g_innerBox.top = thisP.top;
					g_innerBox.left = thisP.left;
					g_innerBox.width = thisP. width;
					g_innerBox.height = thisP.height;
				}
				// Create layer for this panel's contents:
				g_panelLayer = g_myDoc.layers.add();
				g_panelLayer.name = c_panelN + i;
				// Panel colour (rotates after a point)
				pColNo = (i - 1);
				while (pColNo > (c_panelColors.length - 1)) {
					pColNo -= c_panelColors.length
				}
				setLayerColor(g_panelLayer,c_panelColors[pColNo]);
			}
			else {
				msg = "An error occurred drawing panel " + i + "...\n(Panels.doActualPanels)"
				myAlert (msg, "Panel error")
				return false
			}
			// Go to next column
			myLeft += (g_panelWidth + g_gutterWidth);
			// Reinitialise panel reference
			thisP = undefined;
			// Increment overall panel id number
			i ++;
		}
		// Next row
		pTop -= (g_panelHeight + g_gutterHeight);
	}
	return true;
}

// *** LOOKS TO ME (Jan 2016) LIKE THESE NEXT 2 ARE NEVER CALLED ***

// DO H_PANELS
function doHPanels(context)
{
	alert('Why am I trying to call Panels > doHPanels...?')
}
// DO H_PANELS
// DO V_PANELS
function doVPanels(context)
{
	alert('Why am I trying to call Panels > doVPanels...?')
}
// DO V_PANELS


// *** SECTION 2: RECOGNITION ***
// 2 functions find and prepare "active" panel in reflowed chart

//		matchSlot
//		preparePanel


// MATCH SLOT
// Called from Start_up.setUpDocument to check a file that matches site name skeleton
// for a panel matching the setting of the incoming chart
// Any failure/incompatibility returns FALSE, which halts processing
// If either there is a viable panel, or we want to start from scratch,
// return TRUE
// set panel flag to TRUE (draw in a panel) or FALSE (start from scratch)
function matchSlot()
{
	// Active document (g_myDoc) has a recognised chart file name
	var matchLayer;
	var myGroup;
	var myItem;
	var i;									// counter
	var layerCount;
	// Get name of panel to match:
	var s = c_panelN + g_thisPanelNo;
	var pattern = RegExp(s)
	var ppResult;
	var existingPCount = 0;					// number of panel slots in existing chart
	// Is there a Background layer?
	for (i = 0; i < g_myDoc.layers.length; i++) {
		if (g_myDoc.layers[i].name == c_backLayerN) {
			matchLayer = g_myDoc.layers[i];
		}
	}
	// If no background layer was found, ask if user wants to continue
	// Default is No
	if (matchLayer == undefined) {
		// Alert is site-specific (Economist/Financial Times)
		msg = startFromScratchQueryMsg(g_myDoc.name)
		if (confirm(msg,false)) {
			g_panelExists = false		// Flag to build from scratch
			return true;
		}
		else {
			// Force abort
			return false;
		}
		// Flag g_panelExists is false in either case
	}

	// Still here? The file has:
	//		a) a chart-compatible name; and
	// 		b) a Background layer which should contain a background boxes group
	// Loop through all items in the background boxes group,
	// looking for a panel matching the number requested by the incoming DataB file
	try {
		myGroup = g_myDoc.layers[c_backLayerN].groupItems[c_backGroupN]
		// Count total number of panels in artwork
		for (i = 0; i < myGroup.pageItems.length; i++) {
			myItem = myGroup.pageItems[i]
			if (myItem.name.search(c_panelN) > -1) {
				existingPCount ++;
			}
		}

		// If there are no existing panels, throw an error and skip to the
		// catch point, from which processing proceeds by offering to delete
		// everything and start from scratch...
		if (existingPCount == 0) {throw "No panels"};

		// Still here? There is at least one panel in the chart.
		// Does incoming panel-total match number of panels?
		// If not, nudge user. If they want to continue, reset requested number
		// of panels to existing number...
		if (!(existingPCount == g_totalPanelNo)) {
			msg = "Enlighten me...\nYou seem to be trying to flow one of " + g_totalPanelNo +
				" chart(s) into artwork that currently has " + existingPCount +
				" panels. I can handle this if you insist. But do you? Insist, that is...?";
			if (confirm(msg)) {g_totalPanelNo = existingPCount};
			else {return false};
		}

		// Now look for a panel that matches that requested
		for (i = 0; i < myGroup.pageItems.length; i++) {
			myItem = myGroup.pageItems[i]
			// And check for a panel matching specific target slot for incoming data
			if (myItem.name.search(s) > -1) {
				// Panel pathItem found
				// There should be a separate layer having the same name
				// checkReadyPanel verifies:
				//		a) that there is a corresponding panel layer, and
				// 		b) if there is one, gets user confirmation to delete existing contents
				//	Returns true if it's okay to proceed

				if (checkReadyPanel(s)) {
					g_panelExists = true;	// draw in existing panel
					return true;
				}
				else {
					// No panel layer; or user doesn't want to proceed
					g_panelExists = false;
					return false;
				}
			}
		}
	}
	catch (err) {
		// Although there's a named background layer, no
		// background group was found. Ignore error
		// and let code run on to...
	}
	// Still here? That means we didn't find any matching panel.
	// What have we got here then? -- a named chart without a panel to flow into
	// I think we should put this page aside and get the template...
	// msg = "Help me out here...\n"
	// msg += "I realise this is a chart, but I can't find an identifiable panel for new data. "
	// msg += "Okay to put this window aside and start chart from scratch?"
	// REVAMP: change of wording:
	msg = "Help me out here...\n"
	msg += "There is a chart already open. If you click 'Yes', I'll start a completely new chart, from scratch, with the current data. "
	msg += "If you click 'No', I'll do absolutely nothing..."
	if (confirm(msg)) {
		g_panelExists = false		// Flag to build from scratch
		return true
	}
	else {
		return false			// Caller aborts
	}
}
// End MATCH SLOT

// PREPARE PANEL
// Called from Main.Ilex,
// Panels.matchSlot has identified the panel to flow data into
// Identifies elements on the re-opened chart
// Creates inner box for reflow;
// Calls drawPanelHeader to insert panel header and adjust IB
function preparePanel()
{
	var s = c_panelN + g_thisPanelNo;
	var activeP;
	var subT = c_subtitleN + g_thisPanelNo;
	var tTweak;
	var spTweak;
	var thisPTop;
	var i;

	// Unlock details layer (which should exist)
	// (I don't explicitly draw into it, but when aiPrimitives.makeRect calls the rectangle method,
	// it seems to make some sort of default reference to the layer and trips over it if it's locked...)
	try {
		g_myDoc.layers[c_detailsLayerN].locked = false;
	}
	catch(err){};

	// Now let's get a good inner box
	// If there's an existing inner box, delete it; if not (and there shouldn't be) no problem
	try {
		g_myDoc.pathItems[c_innerBoxN].remove();
	}
	catch(err){};
	// Create new inner box, duplicate of active panel
	try {
		// Identify the background boxes group in the background layer
		g_backLayer = g_myDoc.layers[c_backLayerN];
		g_backGroup = g_backLayer.groupItems[c_backGroupN];
		// Identify main back box and active panel
		g_backBox1 = g_backGroup.pathItems[c_backBoxN + 1];
		activeP = g_backGroup.pathItems[s]
		// Source/footnote position
		g_sourceFootnoteHeight = g_backBox1.top - g_backBox1.height;
		g_sourceFootnoteHeight += Math.min(g_sourceOriginY, g_footnoteOriginY);
		// Create inner box as dup. of active panel
		g_innerBox = activeP.duplicate();
		g_innerBox.name = c_innerBoxN;

		g_panelExists = true;				// trip panel flag (not that it's used, I suspect...)

		// To draw a header, drawPanelHeader (called just below) needs to know about the title --
		// It will count down the number of panels and gutters from the title...
		g_titleRange = g_backLayer.textFrames[c_titleN];

		// -- panel height (panels are
		g_panelHeight = activeP.height;

		// Delete existing subtitle -- if one exists
		try {
			g_backLayer.textFrames[subT].remove();
		}
		catch(err){};
		// ...and draw a new one
		if (!drawPanelHeader(g_backLayer, g_subtitle)) {
			return false;
		}

		// Append source and footnote to existing string...
		drawSource(g_backGroup, false);
		drawFootnote(g_backGroup, false);
		return true;
	}
	catch (err) {
		unexpectedErrorAlert(err, "Panels.preparePanel", "Panel error")
		return false;
	}
}
// PREPARE PANEL ends


function updateSource()
{
	var sRange;
	// Find the source:
	try {
		sRange = g_backLayer.textFrames[c_sourceN];
	}
	catch (err) {return};
}

function updateFootnote()
{
}


// CHECK READY PANEL
// Called from matchSlot
// Arg is the name of a panel that exists in the background layer
// Find a corresponding layer and, if it has contents, get user-approval
// to delete them
function checkReadyPanel(pName)
{
	// We're dealing, not with the actual panel (which is in the background layer)
	// but with a layer of the same name:
	try {
		var pLayer = g_myDoc.layers[pName];
		// Does layer have contents?
		if (pLayer.pageItems.length == 0) {
			// Layer is empty -- go ahead!
			return true;
		}
		else {
			// Get user-consent to delete content
			msg = "Overwrite existing artwork?\n" + pName +
				" already contains a chart.\nClick 'Yes' to delete it and replace it with the new data." +
				" Click 'No' to do nothing..."
			if (confirm (msg)) {
				// Delete current contents of this panel's layer
				pLayer.pageItems.removeAll();
				return true;
			}
			else {
				return false;	// Leave it alone!
			}
		}
	}
	catch (err) {
		if (err.number == 1302) {
			msg = "I was unable to find the " + pName +
				" layer containing a chart. Please check the artwork..."
			myAlert(msg, "Panel error")
		}
		else {
			unexpectedErrorAlert(err, "Panels.checkReadyPanel", "Panel error")
		}
		return false;
	}
}
// CHECK READY PANEL ends

// DRAW PANEL HEADER
// Draws panel header. Called from preparePanels (which, in turn, is called
// from Background > drawBackground, after source, footnote and panels)
function drawPanelHeader(bbG, subString)
// Args:    background group
//          string
{
  var myOrigin = new Array(2);
  var   tWidth = g_innerBox.width;
  var stBottom;                                         // IB adjustment
  var tweak;
  var hasOverallSubtitle = false;

  // Translate special characters:
  subString = trans_String(subString)
  // Append thousand/million string
  subString = addValFormat(subString)

	// Is there already an overall subtitle?
	// DO I NEED TO KNOW THIS?
  try {
    var os = activeDocument.textFrames[c_overallSubtitleN];
    hasOverallSubtitle = true;
  }
  catch (err) {}

  // According to whether there's a visible panel or not
  // set positions relative to title/panel and wrap width

  // On-page ID
  tString = c_subtitleN + g_thisPanelNo;

  // Panel subtitle Y-position
  if (g_isRevamp) {
    myOrigin[0] = g_innerBox.top - g_subtitleOriginYPanel;
  }
  else {
		// "Print"
    // Inner box is set to current panel, which may be in row 2+
    // So rather than set subtitle vPos relative to title, set relative to inner box,
    // tweaking by difference between default distances of subtitle and panel below title
    tweak = g_subtitleOriginYPanel - g_panelSpaceAbove;
    myOrigin[0] = g_innerBox.top - tweak;
  }

  // Try drawing the panel flash here...
  if (g_panelFlash) {
        drawPanelFlash(g_backGroup, g_thisPanelNo);
  }

  // X-pos
  switch (g_subtitleAlign.toLowerCase) {
    case c_rConst:                                              // right
      myX = g_innerBox.left + tWidth;
      break;
    case c_cConst:                                              // centre
      myX = g_innerBox.left + (tWidth / 2);
      break;
    default:                                                          // left by default
      myX = g_innerBox.left;
      break;
  }

  myOrigin[1] = myX;

  g_panelHeadRange = makeText(bbG, myOrigin, g_subtitleFontCMYK,
    g_panelHeaderFontName, g_panelHeaderFontSize, g_panelHeaderFontLeading, g_subtitleAlign, 0, 100,
      tWidth, false, subString, tString, tString, false);

  // Check it exists:
  if (g_panelHeadRange !== undefined) {
    // REVAMP: double scale headers. But NOT if this is the
    // main subtitle on a multipanel chart...
    if (g_isRevamp) {
    // Reserve distance between this and current IB top
      stBottom = g_panelHeadRange.anchor[1];
      stBottom -= ((g_panelHeadRange.lines.length - 1) * g_panelHeaderFontLeading);
      tweak = g_innerBox.top - stBottom;
      g_innerBox.top -= tweak;                  // Top
      g_innerBox.height -= tweak;         // Height
      if (g_doubleScale > 0) {
        drawDoubleScaleDummyText(bbG);
        // And add the possible extra depth below subtitle in "subsequent" panel
        g_innerBox.top -= g_panelSubtitleExtra;
        g_innerBox.height -= g_panelSubtitleExtra;
      }
    }
    else {
      // 'Print' chart...
      // Kludge upon kludge! Subsequent panels get that special
      // tweak to the IB...
      if (g_panelExists) {
        g_innerBox.top -= g_panelSubtitleExtra;
        g_innerBox.height -= g_panelSubtitleExtra;
      }
      // Another kludge (25.10.16) for 'print' charts
      // Allow for additional subtitle lines
      // I think I let this get buried in 'isRevamp', above...
      g_innerBox.top -= ((g_panelHeadRange.lines.length - 1) * g_panelHeaderFontLeading);
      g_innerBox.height -= ((g_panelHeadRange.lines.length - 1) * g_panelHeaderFontLeading);
    }
    return true;
  }
  else {
    return false;
  }
}
// End DRAW PANEL HEADER
