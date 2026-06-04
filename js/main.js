var fNameInput = document.getElementById('fName')
var phoneInput = document.getElementById('phone')
var imageInput = document.getElementById('imageInput')
var emailInput = document.getElementById('email')
var addressInput = document.getElementById('address')
var groupInput = document.getElementById('group')
var notesInput = document.getElementById('notes')
var favCheckInput = document.getElementById('favCheck')
var emergencyCheckInput = document.getElementById('emergencyCheck')
var searchInput = document.getElementById('searchInput')
var currentIndex;
var editeBtn = document.getElementById('editeBtn')
var saveBtn = document.getElementById('saveBtn')



var contactList = [];
if (localStorage.getItem('contactsContainer') !== null) {
    contactList = JSON.parse(localStorage.getItem(('contactsContainer')))
    displayContacts()
    displayFavOrEmerg()
    updateTotals()
}


function updateTotals() {
    var totalElement = document.getElementById('total');
    var total1Element = document.getElementById('total1');
    var totalfav = document.getElementById('favTotal');
    var totalEmerg = document.getElementById('emergTotal')

    var countFav = contactList.filter(contact => contact.favCheck).length
    var countEmer = contactList.filter(contact => contact.emergencyCheck).length
    if (totalElement) totalElement.innerHTML = contactList.length;
    if (total1Element) total1Element.innerHTML = contactList.length;
    if (totalEmerg) totalEmerg.innerHTML = countEmer;
    if (totalfav) totalfav.innerHTML = countFav;
}
function addContact() {
    if(validateAllInputs(fNameInput)
    && validateAllInputs(phoneInput)
&& validateAllInputs(emailInput)){

        var contact = {
            fName: fNameInput.value,
            phone: phoneInput.value,
            src: imageInput.files[0] ? `images/${imageInput.files[0]?.name}` : null,
            email: emailInput.value,
            address: addressInput.value,
            group: groupInput.value,
            notes: notesInput.value,
            favCheck: favCheckInput.checked,
            emergencyCheck: emergencyCheckInput.checked
        }
        for(var i =0 ; i<contactList.length;i++){

            if(contactList[i].phone==phoneInput.value){
                   Swal.fire({
            icon:'error',
            title:'Phone Already Exists',
            text:'This phone number is already saved'
        });
        return;
            }
        }
        contactList.push(contact)
    
        const modalElement = document.getElementById('staticBackdrop');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        localStorage.setItem('contactsContainer', JSON.stringify(contactList))
        Swal.fire({
            icon: 'success',
            title: 'Contact Added',
            text: `${contact.fName} has been added successfully!`,
            timer: 1500,
            showConfirmButton: false
        });
        resetInputs()
        displayFavOrEmerg()
        displayContacts()
        updateTotals()
    }
else {
        
        Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fix the errors highlighted in red before adding the contact.',
        });
    }

}

function resetInputs() {
    fNameInput.value = null
    phoneInput.value = null
    imageInput.value = null
    emailInput.value = null
    addressInput.value = null
    groupInput.value = null
    notesInput.value = null
    favCheckInput.checked = false;
    emergencyCheckInput.checked = false;
    if (editeBtn && saveBtn) {
        editeBtn.classList.add('d-none');
        saveBtn.classList.remove('d-none');
    }
}

function displayContacts() {
    var avatar = '';
    var icon = '';  
    var icon1 = ''; 

    var x = '';
    
    if (contactList.length == 0) {
        x = `
            <div class="col-12 d-flex flex-column align-items-center justify-content-center text-center my-5 py-5 fade-in">
                <div class="bg-light p-4 rounded-4 mb-3 d-flex align-items-center justify-content-center shadow-sm logo-box-empty">
                    <i class="fa-solid fa-address-book text-secondary fs-1" style="opacity: 0.5;"></i>
                </div>
                <h5 class="fw-bold text-dark-50 mb-1">No contacts found</h5>
                <p class="text-muted small">Click "Add Contact" to get started</p>
            </div>
        `;
    }
    else {
        for (var i = 0; i < contactList.length; i++) {
            var addressBox = '';
            var group = '';
            
            icon = '';
            icon1 = '';

            if (contactList[i].address && contactList[i].address != '') {
                addressBox = `
                    <div class="d-flex align-items-center gap-2 text-secondary small mb-2 text-start">
                        <i class="fa-solid fa-location-dot text-muted small-icon-width"></i>
                        <span>${contactList[i].address}</span>
                    </div>
                `;
            }

            if (contactList[i].group && contactList[i].group != 'Select a group') {
                group = `<span class="badge rounded-2 px-2 py-1.5 font-medium badge-family-style">${contactList[i].group}</span>`;
            }

            if (contactList[i].src !== null && contactList[i].src !== undefined && contactList[i].src !== '') {
                avatar = `
                    <img src="${contactList[i].src}" class="rounded-3 avatar-initials-box object-fit-cover">
                `;
            } else {
                avatar = `
                    <div class="d-flex align-items-center justify-content-center fw-bold text-white fs-5 rounded-3 Summer avatar-initials-box">
                        ${contactList[i].fName ? contactList[i].fName.slice(0, 2).toUpperCase() : 'CO'}
                    </div>
                `;
            }

            if (contactList[i].favCheck && !contactList[i].emergencyCheck) {
                icon1 = `<span class="position-absolute top-0 start-100 badge rounded-circle bg-warning border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-star text-white inner-badge-icon"></i></span>`;
            }
            else if (contactList[i].emergencyCheck && !contactList[i].favCheck) {
                icon1 = `<span class="position-absolute bottom-0 start-100 badge rounded-circle bg-danger border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-heart text-white inner-badge-icon"></i></span>`;
                icon = `${group} <span class="badge rounded-2 px-2 py-1.5 font-medium badge-emergency-style"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
            }
            else if (contactList[i].emergencyCheck && contactList[i].favCheck) {
                icon1 = `
                    <span class="position-absolute top-0 start-100 badge rounded-circle bg-warning border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-star text-white inner-badge-icon"></i></span>
                    <span class="position-absolute bottom-0 start-100 badge rounded-circle bg-danger border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-heart text-white inner-badge-icon"></i></span>
                `;
                icon = `${group} <span class="badge rounded-2 px-2 py-1.5 font-medium badge-emergency-style"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
            }
            else {
                icon = `${group}`;
            }

            x += `
            <div class="col-md-6">
                <div class="card border-0 bg-white shadow-sm p-4 rounded-4 mb-4 contact-card-main text-start">
                    
                    <div class="d-flex align-items-center gap-3 mb-3">
                        
                        <div class="position-relative d-flex flex-shrink-0">
                            ${avatar}
                            ${icon1}
                        </div>
                        
                        <div>
                            <h5 class="mb-0 fw-bold text-dark text-capitalize">${contactList[i].fName}</h5>
                            <div class="d-flex align-items-center gap-2 text-primary small fw-semibold mt-1">
                                <i class="fa-solid fa-phone fs-6"></i>
                                <span>${contactList[i].phone}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-100 ps-1 mb-2">
                        ${addressBox}
                        
                        <div class="d-flex align-items-center gap-2 text-secondary small mb-2">
                            <i class="fa-solid fa-envelope text-muted small-icon-width"></i>
                            <span class="text-lowercase">${contactList[i].email || '---'}</span>
                        </div>
                        
                        <div class="d-flex gap-2 my-3 justify-content-start align-items-center">
                            ${icon}
                        </div>
                    </div>

                    <hr class="text-black-50 opacity-10 my-3">

                    <div class="d-flex align-items-center justify-content-between w-100 pt-1">
                        
                        <div class="d-flex gap-2">
                            <button onClick="window.open('tel:${contactList[i].phone}','_self')" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center action-btn-phone">
                                <i class="fa-solid fa-phone"></i>
                            </button>
                            <a href="mailto:${contactList[i].email}" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center action-btn-email">
                                <i class="fa-solid fa-envelope"></i>
                            </a>
                        </div>
                        
                        <div class="d-flex gap-2 align-items-center">
                            <button onClick="favourite(${i})" class="btn btn-link p-1 action-btn-star ${contactList[i].favCheck ? 'text-warning' : 'text-secondary'}">
                                <i class="${contactList[i].favCheck ? 'fa-solid fa-star' : 'fa-regular fa-star'} fs-5"></i>
                            </button>
                            <button onClick="emergency(${i})" class="btn btn-sm rounded-3 ${contactList[i].emergencyCheck ? 'text-danger' : 'text-secondary'} p-2 d-flex align-items-center justify-content-center action-btn-heart">
                                <i class="${contactList[i].emergencyCheck ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'}"></i>
                            </button>
                            <button onClick="setContactForUpdate(${i})" class="btn btn-link text-secondary p-1 action-btn-pencil">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button onClick="deleteContact(${i})" class="btn btn-sm rounded-3 btn-outline-dark p-2 d-flex align-items-center justify-content-center action-btn-trash">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        
                    </div>
                    
                </div>
            </div>`;
        }
    }
    document.getElementById('cards').innerHTML = x;
}

function deleteContact(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            contactList.splice(index, 1)
            localStorage.setItem('contactsContainer', JSON.stringify(contactList))
            displayContacts()
            updateTotals()
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Contact has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        }
    })
}

function searchContact() {
    var term = searchInput.value;
    var x = '';
    var avatar = '';

    for (var i = 0; i < contactList.length; i++) {
        icon = '';
        icon1 = '';

        if (contactList[i].fName.toLowerCase().includes(term.toLowerCase()) ||
            contactList[i].phone.includes(term) ||
            contactList[i].email.toLowerCase().includes(term.toLowerCase())) {

            var addressBox = '';
            var group = '';
            
            if (contactList[i].address && contactList[i].address != '') {
                addressBox = `
                    <div class="d-flex align-items-center gap-2 text-secondary small mb-2 text-start">
                        <i class="fa-solid fa-location-dot text-muted small-icon-width"></i>
                        <span>${contactList[i].address}</span>
                    </div>
                `;
            }

            if (contactList[i].group && contactList[i].group != 'Select a group') {
                group = `<span class="badge rounded-2 px-2 py-1.5 font-medium badge-family-style">${contactList[i].group}</span>`;
            }

            if (contactList[i].src !== null && contactList[i].src !== undefined && contactList[i].src !== '') {
                avatar = `
                    <img src="${contactList[i].src}" class="rounded-3 avatar-initials-box object-fit-cover">
                `;
            } else {
                avatar = `
                    <div class="d-flex align-items-center justify-content-center fw-bold text-white fs-5 rounded-3 Summer avatar-initials-box">
                        ${contactList[i].fName ? contactList[i].fName.slice(0, 2).toUpperCase() : 'CO'}
                    </div>
                `;
            }

            if (contactList[i].favCheck && !contactList[i].emergencyCheck) {
                icon1 = `<span class="position-absolute top-0 start-100 badge rounded-circle bg-warning border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-star text-white inner-badge-icon"></i></span>`;
                icon = `${group} <span class="badge rounded-2 px-2 py-1.5 font-medium badge-fav-style"><i class="fa-solid fa-star me-1"></i>Favourite</span>`;
            }
            else if (contactList[i].emergencyCheck && !contactList[i].favCheck) {
                icon1 = `<span class="position-absolute bottom-0 start-100 badge rounded-circle bg-danger border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-heart text-white inner-badge-icon"></i></span>`;
                icon = `${group} <span class="badge rounded-2 px-2 py-1.5 font-medium badge-emergency-style"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
            }
            else if (contactList[i].emergencyCheck && contactList[i].favCheck) {
                icon1 = `
                    <span class="position-absolute top-0 start-100 badge rounded-circle bg-warning border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-star text-white inner-badge-icon"></i></span>
                    <span class="position-absolute bottom-0 start-100 badge rounded-circle bg-danger border border-2 border-white d-flex align-items-center justify-content-center badge-heart-icon"><i class="fa-solid fa-heart text-white inner-badge-icon"></i></span>
                `;
                icon = `${group} <span class="badge rounded-2 px-2 py-1.5 font-medium badge-emergency-style"><i class="fa-solid fa-heart-pulse me-1"></i>Emergency</span>`;
            }
            else {
                icon = `${group}`;
            }

            x += `
            <div class="col-md-6">
                <div class="card border-0 bg-white shadow-sm p-4 rounded-4 mb-4 contact-card-main text-start">
                    
                    <div class="d-flex align-items-center gap-3 mb-3">
                        
                        <div class="position-relative d-flex flex-shrink-0">
                            ${avatar}
                            ${icon1}
                        </div>
                        
                        <div>
                            <h5 class="mb-0 fw-bold text-dark text-capitalize">${contactList[i].fName}</h5>
                            <div class="d-flex align-items-center gap-2 text-primary small fw-semibold mt-1">
                                <i class="fa-solid fa-phone fs-6"></i>
                                <span>${contactList[i].phone}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-100 ps-1 mb-2">
                        ${addressBox}
                        
                        <div class="d-flex align-items-center gap-2 text-secondary small mb-2">
                            <i class="fa-solid fa-envelope text-muted small-icon-width"></i>
                            <span class="text-lowercase">${contactList[i].email || '---'}</span>
                        </div>
                        
                        <div class="d-flex gap-2 my-3 justify-content-start align-items-center">
                            ${icon}
                        </div>
                    </div>

                    <hr class="text-black-50 opacity-10 my-3">

                    <div class="d-flex align-items-center justify-content-between w-100 pt-1">
                        
                        <div class="d-flex gap-2">
                            <button onClick="window.open('tel:${contactList[i].phone}','_self')" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center action-btn-phone">
                                <i class="fa-solid fa-phone"></i>
                            </button>
                            <a href="mailto:${contactList[i].email}" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center action-btn-email">
                                <i class="fa-solid fa-envelope"></i>
                            </a>
                        </div>
                        
                        <div class="d-flex gap-2 align-items-center">
                            <button onClick="favourite(${i})" class="btn btn-link p-1 action-btn-star ${contactList[i].favCheck ? 'text-warning' : 'text-secondary'}">
                                <i class="${contactList[i].favCheck ? 'fa-solid fa-star' : 'fa-regular fa-star'} fs-5"></i>
                            </button>
                            <button onClick="emergency(${i})" class="btn btn-sm rounded-3 ${contactList[i].emergencyCheck ? 'text-danger' : 'text-secondary'} p-2 d-flex align-items-center justify-content-center action-btn-heart">
                                <i class="${contactList[i].emergencyCheck ? 'fa-solid fa-heart-pulse' : 'fa-regular fa-heart'}"></i>
                            </button>
                            <button onClick="setContactForUpdate(${i})" class="btn btn-link text-secondary p-1 action-btn-pencil">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button onClick="deleteContact(${i})" class="btn btn-sm rounded-3 btn-outline-dark p-2 d-flex align-items-center justify-content-center action-btn-trash">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        
                    </div>
                    
                </div>
            </div>`;
        }
    }
    document.getElementById('cards').innerHTML = x;
}
function displayFavOrEmerg() {
    fav = ''
    emer = ''
    avatar = ''

      var countFav = contactList.filter(contact => contact.favCheck).length
    var countEmer = contactList.filter(contact => contact.emergencyCheck).length
    for (var i = 0; i < contactList.length; i++) {
        if (contactList[i].src !== null) {
            avatar = `
        <img src="${contactList[i].src}"
             class="rounded-3"
             style="width:45px;height:45px;object-fit:cover;">
    `;
        }
        else {
            avatar = `
        <div class=" d-flex align-items-center justify-content-center fw-bold text-white fs-5 rounded-3 Summer avatar-initials-box-mini" >
            ${contactList[i].fName.slice(0, 2).toUpperCase()}
        </div>
    `;
        }
        if (contactList[i].favCheck) {
            fav += `<div class="m-2 d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="d-flex align-items-center justify-content-center fw-bold text-white small rounded-2 sidebar-item-avatar">
                                            ${avatar}
                                        </div>
                                        <div class="d-flex flex-column">
                                            <span class="fw-bold text-dark small sidebar-item-name">${contactList[i].fName}</span>
                                            <span class="text-muted sidebar-item-phone">${contactList[i].phone}</span>
                                        </div>
                                    </div>
                                    <button onClick="window.open('tel:${contactList[i].phone}','_self')" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center sidebar-action-phone">
                                        <i class="fa-solid fa-phone fs-6"></i>
                                    </button>
                                </div>`
        }
        if(countFav==0){
            fav=`<p class="text-black-50 text-center h5 m-3">No favorites yet</p>`
        }
         if(countEmer==0){
            emer=`<p class="text-black-50 text-center h5 m-3">No emergency contacts</p>`
        }
        if (contactList[i].emergencyCheck) {
            emer += `<div class="m-2 d-flex align-items-center justify-content-between p-2 rounded-3 bg-light-subtle border border-light">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="d-flex align-items-center justify-content-center fw-bold text-white small rounded-2 sidebar-item-avatar">
                                            ${avatar}
                                        </div>
                                        <div class="d-flex flex-column">
                                            <span class="fw-bold text-dark small sidebar-item-name">${contactList[i].fName}</span>
                                            <span class="text-muted sidebar-item-phone">${contactList[i].phone}</span>
                                        </div>
                                    </div>
                                    <button onClick="window.open('tel:${contactList[i].phone}','_self')" class="btn btn-sm rounded-3 p-2 d-flex align-items-center justify-content-center sidebar-action-phone">
                                        <i class="fa-solid fa-phone fs-6"></i>
                                    </button>
                                </div>`
        }
    }
    document.getElementById('emergency').innerHTML = emer
    document.getElementById('fav').innerHTML = fav
}

function setContactForUpdate(index) {
    currentIndex = index;
    fNameInput.value = contactList[index].fName
    phoneInput.value = contactList[index].phone
    // imageInput.value=contactList[index].src
    emailInput.value = contactList[index].email
    addressInput.value = contactList[index].address
    groupInput.value = contactList[index].group
    notesInput.value = contactList[index].notes
    favCheckInput.checked = contactList[index].favCheck
    emergencyCheckInput.checked = contactList[index].emergencyCheck
    const modalElement = document.getElementById('staticBackdrop');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
    editeBtn.classList.remove('d-none')
    saveBtn.classList.add('d-none')
}
function editeContact() {
        if(validateAllInputs(fNameInput)
    && validateAllInputs(phoneInput)
&& validateAllInputs(emailInput)){
    var originalSrc = contactList[currentIndex].src;
    var newSrc = imageInput.files[0] ? `images/${imageInput.files[0].name}` : originalSrc;
    var contact = {
        fName: fNameInput.value,
        phone: phoneInput.value,
        src: newSrc,
        email: emailInput.value,
        address: addressInput.value,
        group: groupInput.value,
        notes: notesInput.value,
        favCheck: favCheckInput.checked,
        emergencyCheck: emergencyCheckInput.checked
    }
    for(var i=0;i<contactList.length;i++){
    if(contactList[i].phone == phoneInput.value && i != currentIndex){
        Swal.fire({
            icon:'error',
            title:'Phone Already Exists',
            text:'This phone number is already saved'
        });
        return;
    }
}
    contactList.splice(currentIndex, 1, contact)
    displayContacts()
    displayFavOrEmerg()
    updateTotals()
    localStorage.setItem('contactsContainer', JSON.stringify(contactList))
    resetInputs();
    const modalElement = document.getElementById('staticBackdrop');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}
else {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Data',
            text: 'Please fix the errors highlighted in red before adding the contact.',
        });
    }
}
function favourite(index) {
    contactList[index].favCheck = !contactList[index].favCheck
    localStorage.setItem('contactsContainer', JSON.stringify(contactList));


    displayContacts();
    displayFavOrEmerg();
    updateTotals();
}
function emergency(index) {
    contactList[index].emergencyCheck = !contactList[index].emergencyCheck
    localStorage.setItem('contactsContainer', JSON.stringify(contactList));
    displayContacts();
    displayFavOrEmerg();
    updateTotals();
}

function validateAllInputs(element){
var val = element.value
var id = element.id
var regex ={
    fName:/^[a-zA-Zء-ي]{3,}(?:\s[a-zA-Zء-ي]+)*$/,
    phone:/^01[0125][0-9]{8}$/,
    email:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}
if(regex[id].test(val)){
    element.classList.add('is-valid')
    element.classList.remove('is-invalid')
    element.nextElementSibling.classList.replace('d-block','d-none')
    return true;
}
else{
      element.classList.remove('is-valid')
    element.classList.add('is-invalid')
    element.nextElementSibling.classList.replace('d-none','d-block')
    return false;
}
}




