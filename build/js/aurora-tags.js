/*! aurora-tags v0.0.1 | (c) 2020 Danny Bowen | MIT License | https://github.com/wtfdanny/aurora-tags.git */

function Tags(element) {
  var DOMParent = element;
  var DOMList;
  var DOMInput;
  var dataAttribute;
  var arrayOfList;

  function DOMCreate() {
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    var input = document.createElement('input');
    DOMParent.appendChild(ul);
    DOMParent.appendChild(input); // first child is <ul>

    DOMList = DOMParent.firstElementChild; // last child is <input>

    DOMInput = DOMParent.lastElementChild;
  }

  function DOMRender() {
    // clear the entire <li> inside <ul> 
    DOMList.innerHTML = ''; // render each <li> to <ul>

    arrayOfList.forEach(function (currentValue, index) {
      var li = document.createElement('li'); //li.innerHTML = `${currentValue} <a>&times;</a>`

      li.innerHTML = currentValue;
      li.addEventListener('dblclick', function () {
        //if( confirm('Continue to remove tag?') ){
        onDelete(index); //}

        return false;
      });
      var timeout;
      var lastTap = 0;
      li.addEventListener('touchend', function (e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        clearTimeout(timeout);

        if (tapLength < 500 && tapLength > 0) {
          e.preventDefault();
        } else {
          timeout = setTimeout(function () {
            clearTimeout(timeout);
          }, 500);
        }

        lastTap = currentTime;
      });
      DOMList.appendChild(li);
      setAttribute();
    });
  }

  function onKeyUp() {
    DOMInput.addEventListener('keyup', function (event) {
      var text = this.value.trim(); // check if ',' or 'enter' key was press

      if (text.includes(',') || event.keyCode == 13) {
        // check if empty text when ',' is remove
        if (text.replace(',', '') != '') {
          // push to array and remove ','
          arrayOfList.push(text.replace(',', ''));
        } // clear input


        this.value = '';
      }

      DOMRender();
    });
  }

  function onDelete(id) {
    arrayOfList = arrayOfList.filter(function (currentValue, index) {
      if (index == id) {
        return false;
      }

      return currentValue;
    });
    DOMRender();
  }

  function getAttribute() {
    dataAttribute = DOMParent.getAttribute('data-aurora-tags');
    dataAttribute = dataAttribute.split(','); // store array of data attribute in arrayOfList

    arrayOfList = dataAttribute.map(function (currentValue) {
      return currentValue.trim();
    });
  }

  function setAttribute() {
    DOMParent.setAttribute('data-aurora-tags', arrayOfList.toString());
  }

  getAttribute();
  DOMCreate();
  DOMRender();
  onKeyUp();
} // run immediately


(function () {
  var DOMAuroraTags = document.querySelectorAll('.aurora-tags');
  DOMAuroraTags = Array.from(DOMAuroraTags);
  DOMAuroraTags.forEach(function (currentValue, index) {
    // create Tags
    new Tags(currentValue);
  });
})();