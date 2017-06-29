(function() {
	//init
	var container = document.getElementById('container');
	var presetButton = document.getElementById('preset');
	var saveButton = document.getElementById('save');
	var presetDropdown = document.getElementById('presetDropdown');
	var clearSelectionButton = document.getElementById('clear-selection');
	var verticalSliders = container.querySelectorAll('.sliders');
	var bands = [0, 0, 0, 0, 0];
	Array.prototype.forEach.call(verticalSliders, function (verticalSlider, index) {
		noUiSlider.create(verticalSlider, {
			start: bands[index],
			orientation: 'vertical',
			connect: [false, true],
			format: wNumb({
				decimals: 0
			}),
			range: {
				'min': -12,
				'max': 12
			}
		});
		verticalSlider.noUiSlider.on('update', function (argument) {
			var baseElem = this.target.querySelector('.noUi-connect');
			var currentValue = parseInt(this.get());
			var redValue = (( 12 + currentValue )/12) * 60;
			baseElem.style.backgroundColor = 'hsl('+ redValue + ',100%, 50%)';
		});
	});
	var masterData = [
		{
			preset: 'rock',
			equilizers: [2, -1, -8, -5, 8]
		},
		{
			preset: 'pop',
			equilizers: [-6, 0, 6, -5, 4]
		},
		{
			preset: 'jazz',
			equilizers: [2, 10, 0, -5, -2]
		},
		{
			preset: 'classical',
			equilizers: [-8, 8, -5, 5, -7]
		}
	];

	function render() {
		presetDropdown.innerHTML = '';
		masterData.forEach(function (presetObj) {
			var preset = presetObj.preset;
			var element = document.createElement('a');
			element.setAttribute('href', '#' + preset);
			element.dataset.presetValue = preset;
			element.className = 'music-type';
			var textNode = document.createTextNode(preset);
			element.appendChild(textNode);
			if(presetObj.custom === true) {
				setActivePreset(element);
				element.dataset.custom = true;
				var removeButton = document.createElement('button');
				removeButton.innerHTML = 'x';
				removeButton.className = 'remove';
				element.appendChild(removeButton);
			}
			presetDropdown.appendChild(element);
		});
	}
	
	function onPresetClick() {
		presetDropdown.classList.toggle("show");
	}
	function setActivePreset(musicType) {
		if(!musicType.classList.contains('active')) {
			let activeItem = presetDropdown.querySelector('.active');
			activeItem ? activeItem.classList.remove('active') : null;
			musicType.classList.add('active');
		}
		document.getElementById('current-selection').innerHTML = musicType.dataset.presetValue;
	}
	function updateEquilizers(presetIndex) {
		Array.prototype.forEach.call(verticalSliders, function (equilizerControl, index) {
			if(presetIndex == -1) {
				equilizerControl.noUiSlider.set(bands[index]);
			} else {
				equilizerControl.noUiSlider.set(masterData[presetIndex].equilizers[index]);
			}
		});
	}
	function clearSelection() {
		document.getElementById('current-selection').innerHTML = 'none';
		updateEquilizers(-1);
	}
	// event delegation
	function onSelectMusicType(event) {
		event.preventDefault();
		if(event.target.matches('.remove')) {
			var musicType = event.target.parentElement;
			var presetIndex = [].indexOf.call(this.children, musicType);
			masterData.splice(presetIndex, 1);
			render();
			clearSelection();
			return;
		}
		var musicType = event.target;
		var presetIndex = [].indexOf.call(this.children, musicType);
		setActivePreset(musicType);
		updateEquilizers(presetIndex);
	}
	// saving a configuration
	function onSave(event) {
		event.preventDefault();
		var presetNameEl = document.getElementById('preset-name');
		var presetName = presetNameEl.value;
		if(!presetName) {
			return;
		}
		let equilizers = [];
		Array.prototype.forEach.call(verticalSliders, function (equilizerControl, index) {
			equilizers.push(parseInt(equilizerControl.noUiSlider.get()));
		});
		var presetObj = {
			preset: presetName.toLowerCase(),
			equilizers: equilizers,
			custom: true
		}
		masterData.push(presetObj);
		render();
		presetNameEl.value = '';
	}
	// Add event Listerners
	presetButton.addEventListener('click', onPresetClick);
	presetDropdown.addEventListener('click', onSelectMusicType); // event delegation
	saveButton.addEventListener('click', onSave);
	clearSelectionButton.addEventListener('click', clearSelection);
	// Close the dropdown if the user clicks outside of it
	window.onclick = function(event) {
	  if (!event.target.matches('.dropbtn')) {
	    var dropdowns = container.querySelectorAll(".dropdown-content");
	    Array.prototype.forEach.call(dropdowns, function (openDropdown) {
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
	    })
	  }
	}

	render();
})()