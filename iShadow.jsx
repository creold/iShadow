// iShadow.jsx for Adobe Photoshop
// Description: Script create iOS 10 style shadow for one selected layer.
// Requirements: Adobe Photoshop CS3 and higher
// Version: 0.4, September 2017
// Author: Sergey Osokin, graphic designer (hi@sergosokin.ru)
// Website: http://sergosokin.ru
// ============================================================================
// Installation:
// 1. Place script in:
//    PC(32):  C:\Program Files (x86)\Adobe\Adobe Photoshop CS#\Presets\Scripts\
//    PC(64):  C:\Program Files\Adobe\Adobe Photoshop CS# (64 Bit)\Presets\Scripts\
//    Mac:     <hard drive>/Applications/Adobe Photoshop CS#/Presets/Scripts/
// 2. Restart Photoshop
// 3. Choose File > Scripts > iShadow
// ============================================================================
// NOTICE:
// This script is provided "as is" without warranty of any kind.

#target photoshop
app.bringToFront();

//curent version for output
const vers = 'iShadow v0.4'; 
const SETTINGS = vers + "_settings";

var prev = true; //preview
var y, b, s;

// Show dialog
function main() {
	initSettings();
    preview(y, s, b, doc.activeHistoryState);
	uiDialog().show();
};

// uiDialog - get placeholder dimensions
function uiDialog() {
	// declare local variables
	var savedState = doc.activeHistoryState;
		
	// dialog properties
	var dlg = new Window('dialog', vers);
	dlg.orientation = 'column';
	dlg.alignChildren = 'fill';

	// position panel
	dlg.pos = dlg.add('panel');
	dlg.pos.orientation = 'column';
	dlg.pos.alignChildren = 'left';
	dlg.pos.margins = 15;

		// Dialog info
		dlg.pos.i = dlg.pos.add('group');
		dlg.pos.i.orientation = 'row';
		dlg.pos.i.alignment = 'center';
		dlg.pos.i.margins.bottom = 10;
		dlg.pos.i.iPos = dlg.pos.i.add('statictext');
		dlg.pos.i.iPos.text = 'iOS style shadow generator';

		// Offset group
		dlg.pos.y = dlg.pos.add('group');
		dlg.pos.y.orientation = 'row';
		dlg.pos.y.margins.bottom = 10;

			// Offset label
			dlg.pos.y.label = dlg.pos.y.add('statictext');
			dlg.pos.y.label.text = '&Offset:';
    
            //Ofset slider
            dlg.pos.y.sliderPos = dlg.pos.y.add('slider');
			dlg.pos.y.sliderPos.value = y;
			dlg.pos.y.sliderPos.maxvalue = 100;
            dlg.pos.y.sliderPos.onChange = function() {

                y = integerValue(dlg.pos.y.sliderPos.value);
                dlg.pos.y.yPos.text = y;
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Offset field
			dlg.pos.y.yPos = dlg.pos.y.add('edittext');
			dlg.pos.y.yPos.characters = 5;
			dlg.pos.y.yPos.text = y;
			dlg.pos.y.yPos.active = true;
			dlg.pos.y.yPos.onChange = function() {

				// check value
				y = integerValue(this.text);
				this.text = y;
                dlg.pos.y.sliderPos.value = y;                
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Units Offset
			dlg.pos.y.units = dlg.pos.y.add('statictext');
			dlg.pos.y.units.text = 'px';
    
		// Size group
		dlg.pos.s = dlg.pos.add('group');
		dlg.pos.s.orientation = 'row';
		dlg.pos.s.margins.bottom = 10;

			// Scale label
			dlg.pos.s.label = dlg.pos.s.add('statictext');
			dlg.pos.s.label.text = '&Scale:';
    
            //Scale slider
            dlg.pos.s.sliderPos = dlg.pos.s.add('slider');
			dlg.pos.s.sliderPos.value = s;
			dlg.pos.s.sliderPos.maxvalue = 100;
            dlg.pos.s.sliderPos.onChange = function() {

                dlg.pos.s.sPos.text = integerValue(dlg.pos.s.sliderPos.value);
                s = dlg.pos.s.sPos.text;
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Scale field
			dlg.pos.s.sPos = dlg.pos.s.add('edittext');
			dlg.pos.s.sPos.characters = 5;
			dlg.pos.s.sPos.text = s;
			dlg.pos.s.sPos.onChange = function() {

				// check value
				s = integerValue(this.text);
				this.text = s;
                dlg.pos.s.sliderPos.value = s;
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Units Scale
			dlg.pos.s.units = dlg.pos.s.add('statictext');
			dlg.pos.s.units.text = '%';

		// Gaussian blur group
		dlg.pos.b = dlg.pos.add('group');
		dlg.pos.b.orientation = 'row';
		dlg.pos.b.margins.bottom = 10;

			// Blur label
			dlg.pos.b.label = dlg.pos.b.add('statictext');
			dlg.pos.b.label.text = '&Blur:';
    
            // Blur slider
            dlg.pos.b.sliderPos = dlg.pos.b.add('slider');
			dlg.pos.b.sliderPos.value = b;
			dlg.pos.b.sliderPos.maxvalue = 100;
            dlg.pos.b.sliderPos.onChange = function() {

                dlg.pos.b.bPos.text = integerValue(dlg.pos.b.sliderPos.value);
                b = dlg.pos.b.bPos.text;
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Blur field
			dlg.pos.b.bPos = dlg.pos.b.add('edittext');
			dlg.pos.b.bPos.characters = 5;
			dlg.pos.b.bPos.text = b;
			dlg.pos.b.bPos.onChange = function() {

				// check value
				b = integerValue(this.text);
				this.text = b;
                dlg.pos.b.sliderPos.value = b;
                // When checkbox Preview is active
				preview(y, s, b, savedState);
			};

			// Units Blur
			dlg.pos.b.units = dlg.pos.b.add('statictext');
			dlg.pos.b.units.text = 'px';

    // preview checkbox
	dlg.pos.preview = dlg.pos.add('checkbox');
	dlg.pos.preview.text = '&Preview changes';
	dlg.pos.preview.value = prev;
    dlg.pos.preview.alignment = 'center';
	dlg.pos.preview.onClick = function() {
		
        prev = !prev;
		preview(y, s, b, savedState);
	};
    
    // buttons
	dlg.btns = dlg.add('group');
	dlg.btns.orientation = 'row';
	dlg.btns.alignment = 'center';

		// about button
		dlg.btns.info = dlg.btns.add('button');
		dlg.btns.info.text = 'About';
		dlg.btns.info.onClick = function() {
			alert(vers + '\n'+'Created by Sergey Osokin (@creold)\n'+'Behance: http://behance.net/creold\n'+'Contact: hi@sergosokin.ru\n'+'\u00A9 2017');
		};

		// cancel button
		dlg.btns.cancel = dlg.btns.add('button');
		dlg.btns.cancel.text = 'Cancel';
		dlg.btns.cancel.onClick = function() {
			doc.activeHistoryState = oldHistory[oldHistory.length-4];
            dlg.close(2);
		};

		// ok button
		dlg.btns.ok = dlg.btns.add('button');
		dlg.btns.ok.text = 'OK';
		dlg.btns.ok.onClick = function() {
				if (b != 0) {
                    doc.activeHistoryState = savedState;
                    move(0, y);
                    if (s != 0) { scale(s); }
                    curLayer.applyGaussianBlur(b);
                    addStyle();
                    dlg.close(1);
				   saveSettings();
				} else {
                    alert('iShadow\n'+'Enter a Blur value > 0');
                }
		};

	// alignment and layout
	var labelWidth = dlg.pos.y.label.preferredSize.width;
	dlg.pos.s.label.preferredSize.width = labelWidth;
	dlg.pos.b.label.preferredSize.width = labelWidth;


	// dialog properties
	dlg.defaultElement = dlg.btns.ok;
	dlg.cancelElement = dlg.btns.cancel;

	return dlg;
}


function initSettings()
{
	try {  
		var desc = app.getCustomOptions( SETTINGS );
	} catch(e){}  
	if (undefined != desc){
        try {
            
            y = desc.getInteger(0);
            b = desc.getInteger(1);
            s = desc.getInteger(2);
            
            return;
        }
        catch(e) {}
	}
	y = 0, b = 0, s = 100;
}

function saveSettings()
{
	var desc = new ActionDescriptor();
	desc.putInteger(0, y);
	desc.putInteger(1, b);
	desc.putInteger(2, s);
	app.putCustomOptions( SETTINGS, desc, true );
}


function preview(y, s, b, savedState) {
	doc.activeHistoryState = savedState;
	if (prev) {
		move(0, y);
		if (s != 0) { scale(s); }
		curLayer.applyGaussianBlur(b);
	}
	app.refresh();
}

// scale - changing the size of the shadow layer
function scale(s) {
     curLayer.resize( s, s, AnchorPosition.MIDDLECENTER );
}

// move - move selected layers
function move(x, y) {
	curLayer.translate(x, y);
}

function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}


// addstyle — add blend mode, dark color overlay
function addStyle() { 
    curLayer.blendMode = BlendMode.MULTIPLY;
	curLayer.opacity = 95.0;
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Scl '), cTID('#Prc'), 100);
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(cTID('enab'), true);
    desc3.putBoolean(sTID("present"), true);
    desc3.putBoolean(sTID("showInDialog"), true);
    desc3.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Mltp'));
    var desc4 = new ActionDescriptor();
    desc4.putDouble(cTID('Rd  '), 0);
    desc4.putDouble(cTID('Grn '), 0);
    desc4.putDouble(cTID('Bl  '), 0);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), desc4);
    desc3.putUnitDouble(cTID('Opct'), cTID('#Prc'), 15);
    desc2.putObject(cTID('SoFi'), cTID('SoFi'), desc3);
    desc1.putObject(cTID('T   '), cTID('Lefx'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// isCorrectVersion - check for Adobe Photoshop CS3 (v10) or higher
function isCorrectVersion() {
	if (parseInt(version, 10) >= 10) {
		return true;
	}
	else {
		alert('This script requires Adobe Photoshop CS3 or higher.', 'Wrong Version', false);
		return false;
	}
}

// isOpenDocs - ensure at least one document is open
function isOpenDocs() {
	if (documents.length) {
		return true;
	}
	else {
		alert('There are no documents open.', 'No Documents Open', false);
		return false;
	}
}


// duplicate - duplicate and rename new shadow layer
function duplicate() {
	doc.selection.deselect();
	var oldName = curLayer.name,
		shadowLayer = curLayer.duplicate(curLayer, ElementPlacement.PLACEAFTER);
	shadowLayer.name = oldName + "_shadow";
	curLayer = shadowLayer; 
	if (curLayer.allLocked) {curLayer.allLocked = false};
    if (curLayer.pixelsLocked) {curLayer.pixelsLocked = false};
    if (curLayer.positionLocked) {curLayer.positionLocked = false};
    if (curLayer.transparentPixelsLocked) {curLayer.transparentPixelsLocked = false};
}

// check for valid integer value
function integerValue(value) {
	var value = parseInt(value, 10);
	return value ? value : 0;
}


function showError(err) {
	if (confirm('iShadow: an unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}

// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs()) {
	// remember unit settings
	var originalRulerUnits = preferences.rulerUnits,
		doc = app.activeDocument,
		curLayer = doc.activeLayer,
		oldHistory = app.activeDocument.historyStates;
	preferences.rulerUnits = Units.PIXELS;

	try {
		if (curLayer.isBackgroundLayer) {
			alert('iShadow: no selected layer\n'+'Select one layer and restart script');
		} else {
			duplicate();
			// hide script function in history panel
			activeDocument.suspendHistory('iShadow', 'main()');
		}
	}
	catch(e) {
		// don't report error on user cancel
		if (e.number != 8007) {
			showError(e);
		}
	}

	// restore original unit setting
	preferences.rulerUnits = originalRulerUnits;
}