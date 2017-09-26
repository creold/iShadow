// iShadow.jsx for Adobe Photoshop
// Description: Script create iOS 10 style shadow for one selected layer.
// Requirements: Adobe Photoshop CS3 and higher
// Version: 0.2, September 2017
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

if (documents.length) {
	var doc = app.activeDocument;
}

duplicate();

// main - show dialog
function main() {
	uiDialog().show();
}

// uiDialog - get placeholder dimensions
function uiDialog() {
	// declare local variables
	var y = 0, b = 0, s = 100;
    var dy = 0, db = 0, ds = 100; //delta value
    var prev = true; //preview state
	var savedState = doc.activeHistoryState;

	// dialog properties
	var dlg = new Window('dialog', 'iShadow v0.2');
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
		dlg.pos.i.alignment = 'left';
		dlg.pos.i.margins.bottom = 10;
		dlg.pos.i.iPos = dlg.pos.i.add('statictext');
		dlg.pos.i.iPos.text = 'iOS shadow generator';

		// Offset group
		dlg.pos.y = dlg.pos.add('group');
		dlg.pos.y.orientation = 'row';
		dlg.pos.y.margins.bottom = 10;

			// Offset label
			dlg.pos.y.yLabel = dlg.pos.y.add('statictext');
			dlg.pos.y.yLabel.text = '&Offset:';

			// Offset field
			dlg.pos.y.yPos = dlg.pos.y.add('edittext');
			dlg.pos.y.yPos.characters = 5;
			dlg.pos.y.yPos.text = '0';
			dlg.pos.y.yPos.active = true;
			dlg.pos.y.yPos.onChange = function() {
				// check value
				y = checkValue(this.text);
				this.text = y;
                
                // active preview Offset
				if (prev) {
                    doc.activeHistoryState = savedState;
                    move([0, y]);
                    if (s != 0) { scale(s); }
                    blur(b);
                    dy = y;
                    app.refresh();
                }
			};

			// Units
			dlg.pos.y.units = dlg.pos.y.add('statictext');
			dlg.pos.y.units.text = 'px';

		// Size group
		dlg.pos.s = dlg.pos.add('group');
		dlg.pos.s.orientation = 'row';
		dlg.pos.s.margins.bottom = 10;

			// Scale label
			dlg.pos.s.sLabel = dlg.pos.s.add('statictext');
			dlg.pos.s.sLabel.text = '&Scale:';

			// Scale field
			dlg.pos.s.sPos = dlg.pos.s.add('edittext');
			dlg.pos.s.sPos.characters = 5;
			dlg.pos.s.sPos.text = '100';
			dlg.pos.s.sPos.onChange = function() {

				// check value
				s = checkValue(this.text);
				this.text = s;
                
                // active preview Scale
				if (prev) {
                    doc.activeHistoryState = savedState;
                    move([0, y]);
                    if (s != 0) { scale(s); }
                    blur(b);
                    ds = s;
                    app.refresh();
                }
			};

			// units
			dlg.pos.s.units = dlg.pos.s.add('statictext');
			dlg.pos.s.units.text = '%';

		// Gaussian blur group
		dlg.pos.b = dlg.pos.add('group');
		dlg.pos.b.orientation = 'row';
		dlg.pos.b.margins.bottom = 10;

			// Blur label
			dlg.pos.b.bLabel = dlg.pos.b.add('statictext');
			dlg.pos.b.bLabel.text = '&Blur:';

			// Blur field
			dlg.pos.b.bPos = dlg.pos.b.add('edittext');
			dlg.pos.b.bPos.characters = 5;
			dlg.pos.b.bPos.text = '0';
			dlg.pos.b.bPos.onChange = function() {

				// check value
				b = checkValue(this.text);
				this.text = b;
                
                // active preview Blur
				if (prev) {
                    doc.activeHistoryState = savedState;
                    move([0, y]);
                    if (s != 0) { scale(s); }
                    blur(b);
                    db = b;
                    app.refresh();
                }
			};

			// units
			dlg.pos.b.units = dlg.pos.b.add('statictext');
			dlg.pos.b.units.text = 'px';

    // preview checkbox
	dlg.pos.preview = dlg.pos.add('checkbox');
	dlg.pos.preview.text = '&Preview changes';
	dlg.pos.preview.value = prev;
	dlg.pos.preview.onClick = function() {
        prev = !prev;
		if (prev) {
            doc.activeHistoryState = savedState;
            move([0, y]);
            if (s != 0) { scale(s); }
            blur(b);
            dy = y;
            ds = s;
            db = b;
            app.refresh();
		} else {
            doc.activeHistoryState = savedState;
            app.refresh();
        }
	};
    
    // buttons
	dlg.btns = dlg.add('group');
	dlg.btns.orientation = 'row';
	dlg.btns.alignment = 'center';

		// cancel button
		dlg.btns.cancel = dlg.btns.add('button');
		dlg.btns.cancel.text = 'Cancel';
		dlg.btns.cancel.onClick = function() {
			doc.activeHistoryState = savedState;
			doc.activeLayer.remove();
            app.purge (PurgeTarget.HISTORYCACHES);
            dlg.close(2);
		};

		// ok button
		dlg.btns.ok = dlg.btns.add('button');
		dlg.btns.ok.text = 'OK';
		dlg.btns.ok.onClick = function() {
				if (b != 0) {
                    doc.activeHistoryState = savedState;
                    move([0, y]);
                    if (s != 0) { scale(s); }
                    blur(b);
                    addStyle();
                    dlg.close(1);
				} else {
                    alert("Please input Blur value");
                }
		};

	// alignment and layout
	var labelWidth = dlg.pos.y.yLabel.preferredSize.width;
	dlg.pos.s.sLabel.preferredSize.width = labelWidth;
	dlg.pos.b.bLabel.preferredSize.width = labelWidth;


	// dialog properties
	dlg.defaultElement = dlg.btns.ok;
	dlg.cancelElement = dlg.btns.cancel;

	// check for valid integer value
	function checkValue(value) {
		var value = parseInt(value, 10);
		return value ? value : 0;
	}

	return dlg;
}

// duplicate - duplicate and rename new shadow layer
function duplicate() {
	var oldName = doc.activeLayer.name;
	var shadowLayer = doc.activeLayer.duplicate(doc.activeLayer, ElementPlacement.PLACEAFTER);
	shadowLayer.name = oldName + "_shadow";
	doc.activeLayer = shadowLayer;
	if (doc.activeLayer.allLocked == true) {doc.activeLayer.allLocked = false};
    if (doc.activeLayer.pixelsLocked == true) {doc.activeLayer.pixelsLocked = false};
    if (doc.activeLayer.positionLocked == true) {doc.activeLayer.positionLocked = false};
    if (doc.activeLayer.transparentPixelsLocked == true) {doc.activeLayer.transparentPixelsLocked = false};
}

// scale - changing the size of the shadow layer
function scale(s) {
     doc.activeLayer.resize( s, s, AnchorPosition.MIDDLECENTER );
}

function cTID(s) {return app.charIDToTypeID(s);}
function sTID(s) {return app.stringIDToTypeID(s);}

// move - move selected layers
function move(coords) {
	var desc1 = new ActionDescriptor();
	var ref1 = new ActionReference();
	ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
	desc1.putReference(cTID('null'), ref1);
	var desc2 = new ActionDescriptor();
	desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), coords[0]);
	desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), coords[1]);
	desc1.putObject(cTID('T   '), cTID('Ofst'), desc2);
	executeAction(cTID('move'), desc1, DialogModes.NO);
}

//blur — apply Gaussian Blur for layer
function blur(b) {
	var idGsnB = charIDToTypeID( "GsnB" );
	var desc = new ActionDescriptor();
	var idRds = charIDToTypeID( "Rds " );
	var idPxl = charIDToTypeID( "#Pxl" );
	desc.putUnitDouble( idRds, idPxl, b );
	executeAction( idGsnB, desc, DialogModes.NO ); 
}

// addstyle — add blend mode, dark color overlay
function addStyle() { 
    doc.activeLayer.blendMode = BlendMode.MULTIPLY;
	doc.activeLayer.opacity = 95.0;
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

function showError(err) {
	if (confirm('An unknown error has occurred.\n' +
		'Would you like to see more information?', true, 'Unknown Error')) {
			alert(err + ': on line ' + err.line, 'Script Error', true);
	}
}

// test initial conditions prior to running main function
if (isCorrectVersion() && isOpenDocs()) {
	// remember unit settings
	var originalRulerUnits = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	try {
		// hide script function in history panel
		activeDocument.suspendHistory('iShadow', 'main()');
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