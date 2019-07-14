function selectContent(src, des) {
	if (src == null)
		return;
	if (des == null)
		return;
	var oindex = src.selectedIndex;
	var olength = des.length;
	if (oindex >= 0) {
		var otext = src.options[oindex].text;
		var ovalue = src.options[oindex].value;
		if (ovalue == "")
			return;
		var tag = 0
		for (i = 0; i < olength; i++) {
			if (otext == des.options[i].text) {
				tag = 1;
				break;
			}
		}
		if (tag == 0) {
			src.options[oindex] = null;
			des.options[olength] = new Option(otext, olength);
			des.options[olength].value = ovalue;
			src.selectedIndex = -1;
		}
	}
}

function moveUp(obj) {
	try {
		if (obj == null)
			return;
		with (obj) {
			if (selectedIndex == 0) {
				options[length] = new Option(options[0].text, options[0].value);
				options[0] = null;
				selectedIndex = length - 1;
			} else if (selectedIndex > 0)
				moveG(obj, -1);
		}
	} catch (e) {
	}
}

function moveDown(obj) {
	try {
		if (obj == null)
			return;
		with (obj) {
			if (selectedIndex == length - 1) {
				var otext = options[selectedIndex].text;
				var ovalue = options[selectedIndex].value;
				for (i = selectedIndex; i > 0; i--) {
					options[i].text = options[i - 1].text;
					options[i].value = options[i - 1].value;
				}
				options[i].text = otext;
				options[i].value = ovalue;
				selectedIndex = 0;
			} else if (selectedIndex >= 0 && selectedIndex < length - 1)
				moveG(obj, +1);
		}
	} catch (e) {
	}
}

function moveG(obj, offset) {
	if (obj == null)
		return;
	// alert("11");
	with (obj) {
		var desIndex = selectedIndex + offset;
		var otext = options[desIndex].text;
		var ovalue = options[desIndex].value;
		options[desIndex].text = options[selectedIndex].text;
		options[desIndex].value = options[selectedIndex].value;
		options[selectedIndex].text = otext;
		options[selectedIndex].value = ovalue;
		selectedIndex = desIndex;
	}
}
