﻿/* DeclarationsCreated 10.11.05Updated 23.4.13 with new global...Declares all constants and global variables*/// _________// CONSTANTS// Paths and filesconst c_InstallFolderPrefix = "I_";				// Installation folder prefixconst c_spExtension = ".txt";const c_chartPrefix = "C";						// prefix of chart namesconst c_dataAFile = "DataA.txt";				// temp data filesconst c_dataBFile = "DataB.txt";const c_localPrefsFile = "Local Prefs.txt";		// local prefs file (for installation number)const c_ilexSaveFolder = "~/Desktop/_Ilex/"		// Local 'save' folder// Lookup file markers and separatorsconst c_lookupSep = "==";const c_valSep = "|";const c_comment = ";;";           		// commentsconst c_resPrefix = "&";                // headers & strings in res filesconst c_noChartPoint = "*";			// omitted trace pointconst c_dataSep = "\t";				// tab char separates values in dataA fileconst c_sourceSep = ";";				// separates separate sourcesconst c_extSep = ".";					// file name extension separatorconst c_skipConst = "*";				// "no value" marker in tracesconst c_naConst = "na";const c_blobPrefix = "&blobhead=";		// blob header prefixconst c_tablePrefix = "&tableheader=";	// table headers prefix// Othersconst c_I = "Ilex";					// name for alertsconst c_pS = "/";						// path separatorconst c_scatterHS = ":";				// separator for scatter chart headersconst c_msgIndent = "     ";			// indent for alertsconst c_breakNo = 4;					// for column/bar breaks (must be even)const c_traceLoopNo = 10;				// value after which trace styles loopconst c_1SourceLabel = "Source:";		// source labelsconst c_2SourceLabel = "Sources:";const c_mm = 2.835;					// mm / pointsconst c_italMarker = "<i>";			// marks italic range in key labelsconst c_boldMarker = "<b>";			// marks bold range in key labelsconst c_lightFontMarker = "<lightfont>";			// marks REVAMP light/75K range in key labelsconst c_formatValStrings = Array("", ", ’000", ", m")									// added to subtitle if scales is in thousands or millionsconst c_today = "Today";const c_tomorrow = "Tomorrow";// Keys (hard-wired to points)const c_keyMargin = 20;				// distance between bb1 & key rangeconst c_keyVGap = 10;					// vertical gap between key sets (was 20 till 30.7.18)// Time series constantsconst c_nameConst = "names";const c_yearConst = "years";const c_quarterConst = "quarters";const c_monthConst = "months";const c_weekConst = "weeks";const c_dayConst = "days";const c_hourConst = "hours";// Styles// (Strings are based on names of buttons in Excel, which doesn't use constants here)// (And note that capitalisation breaks general rule)const c_lineConst = "Line";const c_lineStackedConst = "LineStacked";const c_stepLineConst = "Stepline";const c_colSideBySideConst = "ColSideBySide";const c_colStackedConst = "ColStacked";const c_colOverlapConst = "ColOverlap";const c_colThermoConst = "ColThermo";const c_barSideBySideConst = "BarSideBySide";const c_barStackedConst = "BarStacked";const c_barOverlapConst = "BarOverlap";const c_barThermoConst = "BarThermo";const c_pieConst = "Pie";const c_halfPieConst = "HalfPie";const c_nestedHalfPieConst = "NestedHalfPie";const c_scatterConst = "Scatter";// General style constants (line/col/bar/pie/scatter)const c_generalLineConst = "line";const c_generalColConst = "col";const c_generalBarConst = "bar";const c_generalPieConst = "pie";const c_generalScatterConst = "scatter";// Alignmentconst c_lConst = "left";const c_rConst = "right";const c_cConst = "centre";// Time seriesconst c_topLevel = 4;											// highest levelconst c_mLengths = Array(31,28,31,30,31,30,31,31,30,31,30,31)	// month lengths (Jan=0)// Constants for layer/group/item naming// (objects [like ticks] to which an index is appended have a trailing space)// Layersconst c_originatorLayerN = "Originator:";const c_backLayerN = "Background layer";const c_onePanelLayerN = "Contents";const c_detailsLayerN = "Details";//const c_traceLayerN = "Traces layer";// Groupsconst c_backGroupN = "Background boxes";const c_bb1GroupN = "Background box 1";const c_vScaleStringGroupN = "Vertical scale strings ";const c_hScaleStringGroupN = "Horizontal scale strings";const c_vScaleTickGroupN = "Vertical scale ticks ";const c_hScaleTickGroupN = "Horizontal scale ticks";const c_globalPMGroupN = "Global +/- ";const c_accumGroupN = "Accumulated line trace group ";const c_tcolGroupN = "Column trace group ";const c_tbarGroupN = "Bar trace group ";const c_barLabGroupN = "Bar label group";const c_tPieGroupN = "Pie group ";const c_detailsGroupN = "Details boxes";const c_allKeyGroupN = "Keys";const c_thisKeyGroupN = "Key subgroup ";const c_blobGroupN = "Blobs: trace ";const c_thermoGroupN = "Thermometers group";const c_stepGroupN = "Stepline group";const c_blobHeaderGroupN = "Blob header group";const c_tableRuleGroupN = "Rules group";// Itemsconst c_backBoxN = "Background box ";const c_bb1TopStrokeN = "Background box 1 top stroke";const c_bb1BottomStrokeN = "Background box 1 bottom stroke";const c_panelN = "Panel ";const c_panelFlashN = "Pnl flash ";const c_traceN = "Trace ";const c_innerBoxN = "Inner box";const c_titleN = "Title";const c_subtitleN = "Subtitle ";const c_overallSubtitleN = "Overall subtitle";const c_sourceN = "Source";const c_footnoteN = "Footnote";const c_catLabelN = "Category label ";const c_vScaleStringN = "Vertical scale string ";const c_hScaleStringN = "Horizontal scale string ";const c_vScaleTickN = "Vertical scale tick ";const c_hScaleTickN = "Horizontal scale tick ";const c_baselineN = "Baseline";const c_bSymbolN = "Broken scale symbol";const c_tLineN = "Line trace ";const c_tColN = "Column trace ";const c_tBarN = "Bar trace ";const c_barLabN = "Bar label ";const c_tScatGroupN = "Scatter trace ";const c_tPieN = "Pie wedge ";const c_detailsBoxN = "Details box ";const c_keyN = "Key ";const c_thermoN = "Thermometer";const c_thermoBack = "ThermometerBack";const c_thermoFront = "ThermometerFront";const c_blobN = "Blob ";const c_tableRangeN = "Table data range";const c_tableRuleN = "Table rule ";const c_tableTintN = "Table tint ";const c_base2N = "Extra baseline";//// Layer coloursconst c_backColor = new Array(80,120,255);const c_originatorColor = new Array(255,240,150);const c_panelColors = new Array(new Array(200,0,0), new Array(150,0,50), new Array(100,50,0),	new Array(0,50,100), new Array(50,0,50), new Array(50,100,50));const c_traceColor = new Array(90,250,90);const c_detailsColor = new Array(200,200,200);// "Done" flag is appended to panels that "contain" a chartconst c_doneFlag = "_done";// "Contents" flag is appended to layer containing "contents" of a panel...const c_contentsFlag = "_contents";// Line cap/miter defaults (used for shapes)const c_defaultLineEnd = 0;const c_defaultLineMiter = 0;const c_defaultLineMiterLimit = 6;// Pies// Constant "c_dpConst" was arrived at by trial and error in Illustrator.// In a 90-degree segment of a circle, the direction points lie on radii// making an angle of 28.93 degrees from the vertical or horizontal...const c_dpConst = 90 / 28.93;const c_halfPI = Math.PI / 2;		// 90-degrees in radians// Alert for excess font substitutionsconst c_fontSubString = "\n\n...further substitutions not listed...";// For bar chart category labels, this is the amount by which the leading// is less than font size...const c_wrapLeadingMinus = 0.5// Character substitution constantsconst c_escapeChar = "/"			// "Escape" character (mainly allows "@" sign to be passedconst c_escapeSubstitute = "¡"	  // Temporary substitute (see Site-module.trans_String)const c_DonaldAsUser = "Graf12";	// Flags privileged User in Economist.jsxconst c_underscore = "_";// Prefixes for CCI path in DataB.txtconst c_cciPathPrefix = "/Volumes/"// GLOBALS/* These fall into two sections:	external -- values inherited from lookup files	internal*/// ________________// EXTERNAL GLOBALS//// -- PATHSvar g_tempPath;				// contains DataA/B files//var g_cciPath;				// final export//var g_adminPath;				// Adminvar g_indicatorsPath;			// Indicators source foldervar g_iFolder;				// Ilex app folder object (contains Local Prefs.txt)// var g_aiTemplatePath;		// contains AI template file(s)// -- GENERAL PREFSvar g_site;					// Site ("Economist" / "FT")var g_authorPhone;			// MY contact detailsvar g_authorEmail;//var g_sectionList;//var g_isInstalled;			// true if installedvar g_isMM;					// true if working in mm.var g_chartOrigin;			// top left of chart (array of x,y co-ords)var g_detailsOrigin;			// top left of details boxvar g_oneLine;				// depth of a line (pts/mm)//var g_dataAFile;			// 2 data files sent to JS//var g_dataBFile;var g_exportDated;			// export to dated subfolders?var g_draftSave;				// probably redundant... was true for "Chardat" save; if false, save straight to CCI...var g_publicationDate;		// publication date (today/morrow or 1=Sunday to 7=Saturday)var g_copyrightString;		// copyright noticevar g_scaleLeft;				// scale left/right, top/bottom (bar & scatter have own settings)var g_scaleTop;var g_barScaleTop;			// bar scale top/bottomvar g_scatterScaleLeft;		// scatter v-scale left/rightvar g_scatterVScaleLabelAtTop;	// label scatter v-scale at top, unrotated (revamp)var g_leftScaleAlignLeft;		// scale string alignmentvar g_rightScaleAlignLeft;var g_idealVTicks;			// preferred number of value scale ticksvar g_individualTitle;		// multipanels have individualvar g_individualSubtitle;		//		or shared strings?var g_individualFootnote;var g_individualSource;var g_gutterWidth;					// width of gutter betw horiz panels, unles...var g_gutterWidthOneCol;		// ...one-col chartvar g_gutterHeight;					// height of gutter betw vert panelsvar g_dividerWidth;var g_overprintText;			// text overprintsvar g_overprintStroke;		// lines overprintvar g_wrapSqueeze;			// hScale allowed for text wrappingvar g_footnoteMoves;			// true if footnote rather than source moves up if they overlapvar g_brokenScaleMargin;		// broken scale margin...var g_brokenScaleSymbolHeight;	// ...and symbol heightvar g_brokenScaleSymbolWidth;	// ...and widthvar g_showZeroBroken;		// Zeros on broken scales?var g_globalPlusMinus;		// individual/global +/- on scalesvar g_outTickMargin;			// margin between scale string and tick endvar g_inTickMargin;			// margins between tick end and trace boundary, scale side...var g_inTickOtherMargin;		// ...and non-scale sidevar g_vScaleAcross;			// vertical values scale across?var g_vScaleCommas;			// commas in scale vals > 1000 (all vert scales, plus horiz scatters & bars; and tables)var g_showVTopLabel;			// true to show top v-scale label (false at FT)var g_yearsBetween;			// years on/between ticksvar g_tickStart1;				// start/end positions for 4 tick lengthsvar g_tickEnd1;var g_tickStart2;var g_tickEnd2;var g_tickStart3;var g_tickEnd3;var g_tickStart4;var g_tickEnd4;var g_blobColMargin;			// Blobsvar g_blobBarMargin;var g_blobHugCols;			// (blobs go to top/right of chart if "hug" value is undefinedvar g_blobHugBars;var g_blobFontName;var g_blobFontSize;var g_blobFontCMYK;var g_blobBoxMargin;var g_blobBoxFillFlag;var g_blobBoxFillCMYK;var g_blobBoxStrokeFlag;var g_blobBoxStrokeWidth;var g_blobBoxStrokeCMYK;var g_barHScaleAcross;		// bar scales drawn across?var g_scatterHScaleAcross;		// scatter horiz scale across?var g_vScaleLabelAlign;		// label alignment relative to tickvar g_hScaleLabelAlign;var g_barLabelMargin;			// margin between longest bar label and baselinevar g_indexWidth;				// index button diameter and fillvar g_indexCMYK;var g_cbDefault;				// Col/bar -	default width/depthvar g_cbGap;					// 				default gapvar g_cbWideGap;			// 				and gap if datapoint count <= 5var g_oneTraceNoGap;			// If true, single trace bars/cols have no gapvar g_barDepths;				// (Excel only): cluster depths  up to 4 tracesvar g_barDepthExtra;			// (Excel only): extra depth to propose for each trace after 4 (?)var g_showColBroken;			// broken scale base/symbol for cols/bars?var g_pieDonutPercent;		// % size of donut (0 == none)var g_pieItalicValues;		// true italicises values in wedge labelsvar g_pieBoldValues;			// true emboldens values in wedge labelsvar g_pieLightValues;			// For inferential REVAMP Light/75Kvar g_numberChart;			// true if chart is numbered// Keysvar g_keyFontName;var g_keyFontSize;var g_keyFontFollowsSeries;	// If true, use series colour namevar g_keyFontCMYK;var g_keyFontLeading;var g_keyLineLength;				// length for line keys -- also on-chart scatter blob/label linksvar g_keyBoxSize;						// bar/col key box width/heightvar g_keyBoxSizePie;				// pie key box width/heightvar g_keyLabGap;						// key/label gapvar g_keyLinkStrokeWidth;		// On-chart scatter blob linksvar g_keyLinkStrokeCMYK;// Character substitutionsvar g_sourceSymbols;				// sourcevar g_targetSymbols;				// target// Double scale coloursvar g_doubleScaleLeftCMYK;var g_doubleScaleRightCMYK;// Double scale coloursvar g_doubleScaleLeftTextCMYK;var g_doubleScaleRightTextCMYK;var g_doubleScaleLeftTraceCMYK;var g_doubleScaleRightTraceCMYK;// -- DATA_B (Research file)// (I need file name from DataB before I can open section prefs)var g_userName;var g_canEdit = true;		// added Aug 2010: this is the flag to force closure of Ilex artwork on creation							// it defaults to true so that the external "Save CCI" menu command offers full "Graphics" options							// (option is ignored at FT, by the way)var g_title;var g_subtitle;var g_source;var g_footnote;var g_comment;var g_catLabel;var g_highA;var g_lowA;var g_incrementA;var g_highB;var g_lowB;var g_incrementB;var g_accumulate;var g_logScale;var g_invertedScaleA;			// invert? left and rightvar g_invertedScalB;var g_doubleScale;var g_stepline;var g_panel;var g_installationFolder;var g_installation;			// installation (paths file) number: 1-3var g_chartName;var g_sectionFile;var g_chartHeight;var g_chartWidth;var g_chartStyle;var g_timeSeries;var g_subFolderName;var g_isIndex;var g_extraTitle;				// extra space below title...var g_extrasubTitle;			// ...and subtitlevar g_blobFlag;var g_originator;var g_numberFormat;			// normal/'000/mvar g_breakTopScale;			// break top of scale flagvar g_ssLeftMargin;			// substyle left margin (overwrites default left margin)var g_catFootnotes;var g_cciPath;				// Target folder (with ":" separators)// -- SECTION PREFS// Generalvar g_height;			// Actually these are ignored; Ivar g_width;			// use the values in the DataB filevar g_aiTemplateFile;		// Template file namevar g_showDetails;		// show details box flagvar g_drawStrap;		// Add URL strap at bottom of background box// Background box 1// (NB: uses general height and width)var g_bb1FillFlag;var g_bb1FillCMYK;var g_bb1StrokeAll;var g_bb1StrokeAllWidth;var g_bb1StrokeAllCMYK;var g_bb1StrokeAllDash;var g_bb1StrokeTop;var g_bb1StrokeTopWidth;var g_bb1StrokeTopCMYK;var g_bb1StrokeTopDash;var g_bb1StrokeTopEnd;var g_bb1StrokeBottom;var g_bb1StrokeBottomWidth;var g_bb1StrokeBottomCMYK;var g_bb1StrokeBottomDash;var g_bb1StrokeBottomEnd;// Background box 2var g_bb2Flag;var g_bb2OriginX;			// relative to bb1var g_bb2OriginY;var g_bb2Width;var g_bb2Height;var g_bb2FillFlag;var g_bb2FillCMYK;var g_bb2StrokeFlag;var g_bb2StrokeWidth;var g_bb2StrokeCMYK;// Background box 3var g_bb3Flag;var g_bb3OriginX;			// relative to bb1var g_bb3OriginY;var g_bb3Width;var g_bb3Height;var g_bb3FillFlag;var g_bb3FillCMYK;var g_bb3StrokeFlag;var g_bb3StrokeWidth;var g_bb3StrokeCMYK;// Titlevar g_titleOriginX;		// relative to bb1var g_titleOriginY;		// uses baselinevar g_titleAlign;			// l/r/c//var g_titleOrient;var g_titleFontName;var g_titleFontSize;var g_titleFontLeading;var g_titleFontCMYK;// Subtitlevar g_subtitleAlign;var g_subtitleOriginXNoPanel;		// co-ords if no panel...var g_subtitleOriginYNoPanel;var g_subtitleOriginXPanel;		// ... or if there is a panelvar g_subtitleOriginYPanel;//var g_subtitleOrient;var g_subtitleFontName;var g_subtitleFontSize;var g_subtitlePanelFontName;var g_subtitleFontLeading;var g_subtitleFontCMYK;// Sourcevar g_showSource;					// is there a source at all (false for Eco Leaders)var g_sourceSpaceAbove;			// shared by source and footnotevar g_sourceOriginX;var g_sourceOriginY;var g_sourceAlign;var g_sourceFontName;var g_sourceFontSize;var g_sourceFontLeading;var g_sourceFontCMYK;var g_sourceHScale;// Footnotevar g_footnoteAlign;var g_footnoteOriginX;var g_footnoteOriginY;var g_footnoteFontName;var g_footnoteFontSize;var g_footnoteFontLeading;var g_footnoteFontCMYK;var g_footnoteHScale;// Inner boxvar g_innerBoxLeftMargin;var g_innerBoxRightMargin;//var g_innerBoxTopMargin;var g_innerBoxBottomMargin;			// used if no source or footnote// Panelsvar g_panelSpaceAbove;var g_panelBackBoxFillCMYK;var g_panelFillFlag;var g_panelFillCMYK;var g_panelStrokeFlag;var g_panelStrokeWidth;var g_panelStrokeCMYK;var g_onePanelVisible;		// if only one panel, is it visible?// ...and dividersvar g_dividerExists;			// True to draw a divider in panel gapsvar g_dividerFillFlag;var g_dividerFillCMYK;// Panel flash (new, revamp, Sep 2016)var g_panelFlash;var g_panelFlashX;var g_panelFlashY;var g_panelFlashWidth;var g_panelFlashHeight;var g_panelFlashFillCMYK;// Category scale stringvar g_catLabelSpaceAbove;var g_catLabelFontName;var g_catLabelFontSize;var g_catLabelFontLeading;var g_catLabelFontCMYK;var g_catLabelAlign;var g_catHLabelAlignOnChart;	// True centres h-scale label on chart//var g_catLabelOrient;//var g_catLabelKern;var g_catLabelHScale;// Vertical Scale ticks (default; index/zero; base)var g_scaleSpaceAbove;					// margin above scale, no panelvar g_scaleSpaceAboveInPanel;		// margin above scale, in panelvar g_absoluteScaleTop;			// flags for absolute scale top & baselinevar g_absoluteBaseline;var g_vScaleDefaultStrokeWidth;var g_vScaleDefaultStrokeDash;var g_vScaleDefaultCMYK;var g_vScaleIndexStrokeWidth;var g_vScaleIndexCMYK;var g_vScaleBaseStrokeWidth;var g_vScaleBaseCMYK;var g_vScaleLength;var g_vScaleFontName;var g_vScaleFontSize;				// Use for leading toovar g_vScaleFontCMYK;var g_plusMinusSmallerBy;			// Amount by which to reduce fontsize of +/–// Horizontal/category scalevar g_hScaleMainSpaceAbovevar g_hScaleInternalSpaceAbove// Horizontal/category scale stringsvar g_hScaleFontName;var g_hScaleMainFontSize;			// Main and secondary font sizes (use for leading too)var g_hScaleSecondaryFontSize;var g_hScaleFontCMYK;var g_hScaleAlign;var g_hScaleDefaultStrokeDash;//var g_hScaleOrient;//var g_hScaleKern;var g_hScaleHScale;var g_hScaleTickStrokeWidth;var g_hScaleTickCMYK;// TRACES// Lines// General//var g_tLineEnd;var g_tLineMiter;var g_tLineMiterLimit;var g_tLineStyle;			// true uses template graphic styles// Accumulationvar g_accumKeyByLines;var g_accumSetFillCMYK;				// I think this redundant...var g_accumSetTopStrokeWidth;var g_accumSetTopStrokeCMYK;var g_accumSetOtherStrokeWidth;var g_accumSetOtherStrokeCMYK;var g_nonAccumLineFill;				// boolean for normal line fillvar g_nonAccumLineFillCMYK;			// normal line fill cmyk// Line trace 1var g_tLine1FillCMYK;		// fill for accumulatedvar g_tLine1StrokeWidth;	// normal stroke width and colourvar g_tLine1StrokeCMYK;var g_tLine1Dash;var g_tLine1End;// Line trace 2var g_tLine2FillCMYK;var g_tLine2StrokeWidth;var g_tLine2StrokeCMYK;var g_tLine2Dash;var g_tLine2End;// Line trace 3var g_tLine3FillCMYK;var g_tLine3StrokeWidth;var g_tLine3StrokeCMYK;var g_tLine3Dash;var g_tLine3End;// Line trace 4var g_tLine4FillCMYK;var g_tLine4StrokeWidth;var g_tLine4StrokeCMYK;var g_tLine4Dash;var g_tLine4End;// Line trace 5var g_tLine5FillCMYK;var g_tLine5StrokeWidth;var g_tLine5StrokeCMYK;var g_tLine5Dash;var g_tLine5End;// Line trace 6var g_tLine6FillCMYK;var g_tLine6StrokeWidth;var g_tLine6StrokeCMYK;var g_tLine6Dash;var g_tLine6End;// Line trace 7var g_tLine7FillCMYK;var g_tLine7StrokeWidth;var g_tLine7StrokeCMYK;var g_tLine7Dash;var g_tLine7End;// Line trace 8var g_tLine8FillCMYK;var g_tLine8StrokeWidth;var g_tLine8StrokeCMYK;var g_tLine8Dash;var g_tLine8End;// Line trace 9var g_tLine9FillCMYK;var g_tLine9StrokeWidth;var g_tLine9StrokeCMYK;var g_tLine9Dash;var g_tLine9End;// Line trace 10var g_tLine10FillCMYK;var g_tLine10StrokeWidth;var g_tLine10StrokeCMYK;var g_tLine10Dash;var g_tLine10End;// COLUMNS / BARS// Generalvar g_hasColStroke;var g_hasBarStroke;var g_barLabelsAlignLeft;		// align bar labels leftvar g_brokenFontCMYK;			// font colour for top-broken bars/columnsvar g_tCBStyle;				// true uses template graphic stylesvar g_oneBarColUsesStyleTwo;	// true to use style two for single-trace bars/cols// Col/bar trace 1var g_tCB1FillCMYK;var g_tCB1StrokeWidth;var g_tCB1StrokeCMYK;// Col/bar trace 2var g_tCB2FillCMYK;var g_tCB2StrokeWidth;var g_tCB2StrokeCMYK;// Col/bar trace 3var g_tCB3FillCMYK;var g_tCB3StrokeWidth;var g_tCB3StrokeCMYK;// Col/bar trace 4var g_tCB4FillCMYK;var g_tCB4StrokeWidth;var g_tCB4StrokeCMYK;// Col/bar trace 5var g_tCB5FillCMYK;var g_tCB5StrokeWidth;var g_tCB5StrokeCMYK;// Col/bar trace 6var g_tCB6FillCMYK;var g_tCB6StrokeWidth;var g_tCB6StrokeCMYK;// Col/bar trace 7var g_tCB7FillCMYK;var g_tCB7StrokeWidth;var g_tCB7StrokeCMYK;// Col/bar trace 8var g_tCB8FillCMYK;var g_tCB8StrokeWidth;var g_tCB8StrokeCMYK;// Col/bar trace 9var g_tCB9FillCMYK;var g_tCB9StrokeWidth;var g_tCB9StrokeCMYK;// Col/bar trace 10var g_tCB10FillCMYK;var g_tCB10StrokeWidth;var g_tCB10StrokeCMYK;// THERMOMETERSvar g_tCBThermoStrokeFlag;var g_tCBThermo1FillCMYK;var g_tCBThermo1StrokeWidth;var g_tCBThermo1StrokeCMYK;// Col/bar Thermometer trace 2var g_tCBThermo2FillCMYK;var g_tCBThermo2StrokeWidth;var g_tCBThermo2StrokeCMYK;// Col/bar Thermometer trace 3var g_tCBThermo3FillCMYK;var g_tCBThermo3StrokeWidth;var g_tCBThermo3StrokeCMYK;// Col/bar Thermometer trace 4var g_tCBThermo4FillCMYK;var g_tCBThermo4StrokeWidth;var g_tCBThermo4StrokeCMYK;// Col/bar Thermometer trace 5var g_tCBThermo5FillCMYK;var g_tCBThermo5StrokeWidth;var g_tCBThermo5StrokeCMYK;// Col/bar Thermometer trace 6var g_tCBThermo6FillCMYK;var g_tCBThermo6StrokeWidth;var g_tCBThermo6StrokeCMYK;// Col/bar Thermometer trace 7var g_tCBThermo7FillCMYK;var g_tCBThermo7StrokeWidth;var g_tCBThermo7StrokeCMYK;// Col/bar Thermometer trace 8var g_tCBThermo8FillCMYK;var g_tCBThermo8StrokeWidth;var g_tCBThermo8StrokeCMYK;// Col/bar Thermometer trace 9var g_tCBThermo9FillCMYK;var g_tCBThermo9StrokeWidth;var g_tCBThermo9StrokeCMYK;// Col/bar Thermometer trace 10var g_tCBThermo10FillCMYK;var g_tCBThermo10StrokeWidth;var g_tCBThermo10StrokeCMYK;// SCATTERS// Generalvar g_tScatterFillFlag;var g_tScatterStrokeFlag;var g_tScatterShape;var g_tScatterSize;var g_tScatterStyle;			// true uses template graphic styles// Scatter trace 1var g_tScatter1FillCMYK;var g_tScatter1StrokeWidth;var g_tScatter1StrokeCMYK;// Scatter trace 2var g_tScatter2FillCMYK;var g_tScatter2StrokeWidth;var g_tScatter2StrokeCMYK;// Scatter trace 3var g_tScatter3FillCMYK;var g_tScatter3StrokeWidth;var g_tScatter3StrokeCMYK;// Scatter trace 4var g_tScatter4FillCMYK;var g_tScatter4StrokeWidth;var g_tScatter4StrokeCMYK;// Scatter trace 5var g_tScatter5FillCMYK;var g_tScatter5StrokeWidth;var g_tScatter5StrokeCMYK;// Scatter trace 6var g_tScatter6FillCMYK;var g_tScatter6StrokeWidth;var g_tScatter6StrokeCMYK;// Scatter trace 7var g_tScatter7FillCMYK;var g_tScatter7StrokeWidth;var g_tScatter7StrokeCMYK;// Scatter trace 8var g_tScatter8FillCMYK;var g_tScatter8StrokeWidth;var g_tScatter8StrokeCMYK;// Scatter trace 9var g_tScatter9FillCMYK;var g_tScatter9StrokeWidth;var g_tScatter9StrokeCMYK;// Scatter trace 10var g_tScatter10FillCMYK;var g_tScatter10StrokeWidth;var g_tScatter10StrokeCMYK;// Piesvar g_tPieStyle;					// true uses template graphic stylesvar g_pieProportion;				// Relative size of pies within inner boxvar g_pieStrokeFlag;				// Stroke attributesvar g_pieStrokeCMYK;var g_pieStrokeWidth;var g_pieDonutFillCMYK;			// Fill for pie centrevar g_pieDonutFillFlag;			// If false, draw pies hollow...var g_wedge1FillCMYK;				// Fill for up to 10 wedgesvar g_wedge2FillCMYK;var g_wedge3FillCMYK;var g_wedge4FillCMYK;var g_wedge5FillCMYK;var g_wedge6FillCMYK;var g_wedge7FillCMYK;var g_wedge8FillCMYK;var g_wedge9FillCMYK;var g_wedge10FillCMYK;// Tables --// headersvar g_tHeadSpaceAbove;var g_tHeadFontName;var g_tHeadFontSize;var g_tHeadFontLeading;var g_tHeadFontCMYK;var g_tHeadHScale;// contentvar g_tContentFontName;var g_tContentdFontSize;var g_tContentFontLeading;var g_tContentFontCMYK;var g_tContentHScale;// rulesvar g_tRuleAWidth;var g_tRuleACMYK;var g_tRuleADash;var g_tRuleACap;var g_tRuleBWidth;var g_tRuleBCMYK;var g_tRuleADash;var g_tRuleBCap;var g_tRuleBelow;var g_tAlternateTints;var g_tAlternateTintCMYK;// Number box prefs added Mar 2013var g_numberBoxCMYK;var g_numberBoxOffsetTop;var g_numberBoxOffsetRight;var g_numberBoxFontName;var g_numberBoxFontSize;//// SECTION PREFS END// -- DATA_A (data arrays)var g_headArray;				// (not declared as an array)var g_catArray = new Array(0);var g_valArray = new Array(0);var g_blobArray = new Array(0);var g_blobHeadArray;var g_tContentArray = new Array(0);// ________________// INTERNAL GLOBALSvar g_authorContact;					// Updated later with email and mobilevar g_isMac;							// Mac/Windows flagvar g_appVersion;						// Application versionvar g_fontSubstitutions = Array();		// assembles list of substitutions for missing fontsvar g_scratchFile;					// flags new filevar g_desktopPath;					// String points to desktop of Mac or Winvar g_isBS = new Array(false,false);	// broken scale: false by defaultvar g_dataAExists;					// value scale data flagsvar g_dataBExists;var g_leftArray;						// arrays of label values & positions for left & right scales...var g_rightArray;var g_hArray;					// ...and for horizontal scale (bar/scatter)var g_sourceFootnoteHeight		// for v-pos of source & footnotevar g_hScaleBase;				// v.coord for position of cat/horizontal scale (baseline)var g_cbBase = Array(1);		// Bases for cols (left/right) and bars (left only)								// 	(can be zero line or inner box bottom)var g_isTable = false;		// Chart/table flagvar g_yFlag = true;			// forces "yyyy" on first year labelvar g_colWidth;				// width of each column in any one tracevar g_barHeight;				// height of each bar in any one tracevar g_prevTArray;				// holds values from prev trace for accum'd/stacked cols/barsvar g_prevTopsArray;var g_prevBottomsArray;var g_overallStyle;			// broad style (line/col/bar...)var g_barLabelLeft;			// bar chart labels' left origin...var g_clusterHeight;			// ...height of ALL bars, minus gap...var g_barLabelHeight;			// ...individual label height...var g_barLabelTweak;			// ...and difference between label textRange anchor & bottom of test outlinevar g_pieCentres;				// array of arrays of pie centre coordsvar g_pieRadius;				// radius for piesvar g_pieAngle;				// incrementing angle of rotationvar g_keyArray;				// holds key strings and attributesvar g_traceArena;				// desired left & right of traces areavar g_allTraces;				// array of all trace group objectsvar g_marginsPostAdjustFlag = false;							// flag for those styles adjusting margins after traces drawn...var g_blobSize= new Array(2);	// Array holds blob box width & height							// and centre pos (v for cols, h for bars)var g_preScaleLabelPos;		// remembers inner box before scale labels are drawn							// so that if labels are above/below ticks, the latter							// can extend to edge...var g_catLabelH;				// label holders for scales (catLabelH acquires DataB "catLabel" value;var g_catLabelV;				// for scatters, these get first two trace headers)var g_toPoints = 1;			// for mm/pts conversion (default = points)var g_line2ScaleFormat = 2;	// format for h-scale sub-scale							// (2 = "Mmm"; 1 = "M"; 0 = none)var g_labHeight;				// holds height of v-scale labels for adjustmentvar g_hScaleFlip = false;		// if true, horizontal scale is flipped outside inner box							// to avoid columns/layer cakesvar g_trHeight;				// cumulative height of content lines in tablesvar g_baselineTick;			// identifies baseline when v-scale createdvar g_tintBoxTop;				// keeps track of table alternate tint boxesvar g_catSymbolAttachLevel;			// Flags whether footnote symbols attach to labels, ticks or trace pointsvar g_blobHeadAlreadyDrawn = false;		// Flags whether a blob header has been drawn...var g_defaultChartTime;		// Holds default chart date in millisecs; currently used only within Economist.jsx							  // to remember default chart date for save-CCI// 2 names of general-purpose containers break rule:var msg = "";				// message containervar pattern = "";				// RegExp container// Panel attributes:var g_thisPanelNo;			// Panel number...var g_totalPanelNo;			// ...ofvar g_panelRowNo;				// ...on no. of rows//var g_isPanelH;				// horiz. or vert.var g_panelExists;			// set to true if start-up finds a panel to draw intovar g_panelWidth;				// width of a single panelvar g_panelHeight;			// depth of a single panelvar g_panelSubtitleExtra = 0;	// Nasty little kludge to allow me to drag in the extra depth							// below subtitle if flowing into an existing panel. This is							// to get around the fact that this extra depth was only							// handled when multi-panel charts were first created...// Active documentvar g_myDoc;// Layers and groupsvar g_originatorLayer;		// Empty layer identifies originatorvar g_backLayer;				// Background layervar g_panelLayer;				// Active panel layervar g_traceLayer;				// Traces layervar g_detailsLayer			// layer for details boxesvar g_backGroup;				// Background groupvar g_vScaleStringGroup;		// Scale stringsvar g_hScaleStringGroup;var g_vScaleTickGroup;		// Scale ticksvar g_hScaleTickGroup;var g_globalPMGroup;			// Global plus/minusvar g_accumGroup;				// grouped fill and line paths for accumulated line tracesvar g_colGroup;				// group all cols/bars in one tracevar g_barGroup;var g_barLabGroup;			// bar labelsvar g_scatGroup;				// scatter trace groupvar g_detailsGroup			// group all details boxesvar g_blobGroup;var g_tableRuleGroup;// On-page itemsvar g_backBox1;				// Background boxesvar g_backBox2;var g_innerBox;				// Inner boxvar g_strapBox;				// URL strap box (bottom of some charts)var g_Panel1;					// Panels (up to 6)var g_Panel2;var g_Panel3;var g_Panel4;var g_Panel5;var g_Panel6;var g_currentPanel;		// Whichever panel is being drawn now...var g_titleRange;var g_subtitleRange;var g_panelHeadRange;var g_sourceRange;var g_footnoteRange;var g_catStringRangeH;var g_catStringRangeV;var g_tableRange;				// Table header/content rangevar g_indexBlob;				// Index button// And for referencing back to original innerBox (specifically, for panels)var g_originalInnerBox;// Arrays for min/max point coords for thermometersvar g_thermoRawPointArray = [];// var g_thermoMinMaxArray = [];// CCI flag. This is set true (Economist) or false (FT) in the main// body of Economist/Financial Times.jsx (ie at inclusion)var g_CCI;// REVAMP flag to force ticks on column charts...var g_forceColumnTicks = false;// REVAMP globals for 'crossbar' thermometer markersvar g_thermoCross=false;var g_thermoCrossLength;var g_thermoCrossWidth;// And key size:var g_keyBoxSizeThermoCross;// REVAMP: distance of any doublescale labels below subtitle// Font name and sizevar g_doubleScaleDummyBelowSubtitle;var g_doubleScaleHeaderFontName;var g_doubleScaleHeaderFontSize;var g_doubleScaleHeaderLeading;// REVAMP: tweak for tick-tops on bar charts with scale at top:var g_revampBarAtTopTweak;// REVAMP: for blob headersvar g_blobHeaderBoxHeight;var g_blobHeaderFontSize;var g_blobHeaderFontLeading;// REVAMP: for overall subtitles on panel charts (section):var g_gapBetweenOverallSubtitleAndPanel;var g_panelSubSubtitleFontName;var g_panelSubSubtitleFontSize;var g_panelSubSubtitleFontLeading;var g_panelSubSubtitleFontCMYK;var g_panelHeaderFontName;var g_panelHeaderFontSize;var g_panelHeaderFontLeading;var g_panelHeaderFontCMYK;// REVAMP: flag for LD special stylsvar g_drawLeaderStyle;// And a flag that tells the code that this is a revamp!!var g_isRevamp=false;// Flag to prevent extended looping on failing AI_Primitives 'makeHandlers'var g_primitiveError=false;// Hidden flags for backgroundsvar g_bb2Hidden;var g_bb3Hidden;// New val for gap between source and footnotevar g_sourceFootnoteGap;// Flag determines whether strings are adjusted for any distance between anchor and visual edgevar g_fineTuneStringOrigins;// ENDS