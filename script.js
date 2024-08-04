const updateCurrentPageAndTotalPagesDisplay = function() {
    const currentPageDisplay = document.getElementById('agenda-current-page');
    const totalPagesDisplay = document.getElementById('agenda-total-pages');

    if (book.leftSidePageNumber <= 0) /* If the left side page is 0 or below, it means that the agenda is in the first page. */
    {
        currentPageDisplay.value = `${book.rightSidePageNumber.toString().padStart(2, '0')}`;
        currentPageDisplay.style.width = (currentPageDisplay.value.length) + 2 + 'ch';
        totalPagesDisplay.innerText = `/${book.numberOfPages.toString().padStart(2, '0')}`
        return;
    }
    if (book.rightSidePageNumber >= book.numberOfPages) /* If the right page is equal to the total of number of pages or bigger, it means that the agenda is in the last page. */
    {
        currentPageDisplay.value = `${book.leftSidePageNumber.toString().padStart(2, '0')}`;
        currentPageDisplay.style.width = (currentPageDisplay.value.length) + 2 + 'ch';
        totalPagesDisplay.innerText = `/${book.numberOfPages.toString().padStart(2, '0')}`
        return;
    }

    /* Else the agenda is opened in any other page. */
    currentPageDisplay.value = `${book.leftSidePageNumber.toString().padStart(2, '0')} - ${book.rightSidePageNumber.toString().padStart(2, '0')}`;
    currentPageDisplay.style.width = (currentPageDisplay.value.length) + 'ch';
    totalPagesDisplay.innerText = `/${book.numberOfPages.toString().padStart(2, '0')}`
}

const book = {
    numberOfPages: 2,
    leftSidePageNumber: 0, /* Left side page number. If 0 there is no page on the left side, so its the first page. */
    rightSidePageNumber: 1, /* Right side page number If 0 there is no page on the right side, so its the last page. */
    leftSidePageIndex: -1, /* Left side page index in the array. If < 0, there is no page on the left side, so its the first page. */
    rightSidePageIndex: 0, /* Right side page index in the array. If < 0, there is no page on the right side, so its the last page. */
    isFirstPage: true,
    isLastPage: false,
    isFlippingForward: false,
    isFlippingBackward: false,
    agenda: document.getElementById('agenda'),
    pages: agenda.getElementsByClassName('page-container'),
    flippedPages: agenda.getElementsByClassName('page-container flipped'),
    emptyTableRows: agenda.getElementsByClassName('empty'),
    transitionTime: 1000, /* ms */


    flipPageForward: function()
    {
        if (this.isLastPage == true) return; /* If it is already on the last page, return without doing nothing. */

        let pageToFlip = this.pages[this.rightSidePageIndex];
        pageToFlip.classList.add('flipped'); /* Flips the page */
        this.updateZIndex(pageToFlip); /* Updates the Z-index of the flipped page */

        /* Update the values */
        this.leftSidePageIndex += 1;
        this.leftSidePageNumber += 2;

        this.rightSidePageIndex += 1;
        this.rightSidePageNumber += 2;

        this.isFirstPage = false;

        updateCurrentPageAndTotalPagesDisplay(); /* Updates the display values for the current page and the number of pages. */
        this.saveAgendaToCache();

        if (this.rightSidePageIndex > (this.pages.length - 1)) /* If the flipped page is the last of the agenda */
        {
            this.isLastPage = true;

            this.saveAgendaToCache();
            return;
        }
    },

    flipPageBackward: function()
    {
        if (this.isFirstPage == true) return; /* If it is already on the last page, return without doing nothing. */

        let pageToFlip = this.pages[this.leftSidePageIndex];
        pageToFlip.classList.remove('flipped'); /* Flips the page */
        this.updateZIndex(pageToFlip); /* Updates the Z-index of the flipped page */

        /* Update the values */
        this.leftSidePageIndex -= 1;
        this.leftSidePageNumber -= 2;

        this.rightSidePageIndex -= 1;
        this.rightSidePageNumber -= 2;

        this.isLastPage = false;

        updateCurrentPageAndTotalPagesDisplay(); /* Updates the display values for the current page and the number of pages. */
        this.saveAgendaToCache();

        if (this.leftSidePageIndex < 0) /* If the flipped page is the last of the agenda */
        {
            this.isFirstPage = true;

            this.saveAgendaToCache();
            return;
        }
    },

    goToPage: function(pageNumber) {
        if (this.numberOfPages < pageNumber || this.leftSidePageNumber == pageNumber || this.rightSidePageNumber == pageNumber) return; /* If the page inputed is bigger than the number of existing pages or already is the current page, return without doing anything. */
        
        if (pageNumber >  Math.max(this.rightSidePageNumber, this.leftSidePageNumber)) /* If the desired page is bigger than the current page, then need to flip forward. */
        { 
            const pagesToFlip = Math.ceil((pageNumber - this.rightSidePageNumber) / 2);
            const currentRightSidePageIndex = this.rightSidePageIndex; 
            const flipToPage = currentRightSidePageIndex + pagesToFlip;

            console.log(`Array Left Page: ${this.rightSidePageIndex} -- Pages to flip: ${pagesToFlip}`)
            for (let i = currentRightSidePageIndex; i < flipToPage; i++ ) {
                console.log(i)
                this.flipPageForward();
            }

            updateCurrentPageAndTotalPagesDisplay();
            this.saveAgendaToCache()

            return;
        }

        if (pageNumber < this.leftSidePageNumber) /* If the desired page is smaller than the current page, then need to flip backward. */
        {
            var pagesToFlip = Math.ceil((this.leftSidePageNumber - pageNumber) / 2);
            const currentLeftSidePageIndex = this.leftSidePageIndex; 
            const flipToPage = currentLeftSidePageIndex - pagesToFlip;

            console.log(`Array Left Page: ${this.leftSidePageIndex} -- Pages to flip: ${pagesToFlip}`)
            for (let i = currentLeftSidePageIndex; i > flipToPage; i-- ) {
                this.flipPageBackward();
            }

            updateCurrentPageAndTotalPagesDisplay();
            this.saveAgendaToCache()

            return;
        }
    },

    resetFlippingState: function(event) {
        if (!event.target.classList.contains('page-container')) return; /* Continue just if the transition that ended is from element with class 'page-container' */

        this.isFlippingForward = false;
        this.isFlippingBackward = false;
    },

    updateZIndex: function(target) {
        setTimeout(() => { target.style.zIndex *= -1; }, (this.transitionTime / 2)); /* Wait half of the transition time to change the z-index */
    },

    addPage: function(event) {
        pageHTML = `<div class="page-container" style="z-index: ${this.numberOfPages * -1};">
        <div class="page-front">
            <div class="page-shadow"></div>
            <div class="page-table">
                <table>
                    <thead>
                        <th class="name">NOME</th>
                        <th class="phone">TELEFONE</th>
                    </thead>
                    <tbody>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="page-number">${(this.numberOfPages + 1).toString().padStart(2, '0')}</h3>
        </div>
        <div class="page-back">
            <div class="page-shadow"></div>
            <div class="page-table">
                <table>
                    <thead>
                        <th class="name">NOME</th>
                        <th class="phone">TELEFONE</th>
                    </thead>
                    <tbody>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                        <tr class="empty">
                            <td class="name"></td>
                            <td class="phone"></td>
                            <td class="delete-contact">
                                <button class="btn-delete-contact" name="Delete contact" >
                                    <svg viewBox="0 0 470.713 470.714" style="pointer-events: none;"><use href="#svg-icon-trash"/></svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="page-number">${(this.numberOfPages + 2).toString().padStart(2, '0')}</h3>
        </div>
</div>`;
        this.agenda.innerHTML += pageHTML;

        this.numberOfPages += 2;

        if (this.isLastPage == true) /* If the user is on the last page, set the current page to newly created page, and set the isLastPage to false, since the user is not on the last page anymore */
        {
            this.rightSidePage = this.leftSidePageNumber + 1;
            this.isLastPage=false;
        }

        console.log(`${book.leftSidePageNumber}/${book.numberOfPages}`)
        updateCurrentPageAndTotalPagesDisplay();
        this.saveAgendaToCache()
    },

    deletePage: function() {
        if (this.numberOfPages < 3) return; /* Don't delete if there is just one page left. */

        const lastPage = this.pages[this.pages.length-1];
        this.numberOfPages -= 2;
        lastPage.remove();
        
        if (this.isLastPage == true)
        {
            this.leftSidePageNumber -= 2;
            this.leftSidePageIndex -= 1;

            this.rightSidePageIndex -= 1;
            this.rightSidePageNumber -= 2;

            updateCurrentPageAndTotalPagesDisplay();
            this.saveAgendaToCache()

            return;
        }

        if (this.rightSidePageIndex > this.pages.length-1)
        {
            this.isLastPage = true;

            updateCurrentPageAndTotalPagesDisplay();
            this.saveAgendaToCache()

            return;
        }

        updateCurrentPageAndTotalPagesDisplay();
        this.saveAgendaToCache()
    },

    addContact:function() {
        const nameToAddElement = document.getElementById('name-input')
        const nameToAdd = nameToAddElement.value;
        const photoAddElement = document.getElementById('phone-input');
        const phoneToAdd = photoAddElement.value;

        const errorPhoneElement = document.getElementById('error-phone');

        if (isNaN(phoneToAdd))
        {
            errorPhoneElement.classList.remove('display-none');

            this.saveAgendaToCache()
            return;
        }

        errorPhoneElement.classList.add('display-none');

        firstEmptyRow = this.emptyTableRows[0];
        if (!firstEmptyRow)
        {
            this.addPage();
            firstEmptyRow = this.emptyTableRows[0];
        }

        
        firstEmptyRow.getElementsByClassName('name')[0].innerText = nameToAdd;
        firstEmptyRow.getElementsByClassName('phone')[0].innerText = phoneToAdd;

        firstEmptyRow.classList.remove('empty');
        nameToAddElement.value = '';
        photoAddElement.value = '';

        this.saveAgendaToCache()
    },

    deleteContact:function(event) {
        if (!event.target.classList.contains('btn-delete-contact')) return; /* Verifica se o evento foi disparado pelo botão de deletar o contato. */

        var parent = event.target.parentElement;
        console.log(parent)
        while (parent.nodeName != "TR") {
            parent = parent.parentElement;
            console.log(parent)
        }
        parent.getElementsByClassName('name')[0].innerText = '';
        parent.getElementsByClassName('phone')[0].innerText = '';

        parent.classList.add('empty')

        this.saveAgendaToCache()
    },

    saveAgendaToCache:function() {
        localStorage['agendaHTML'] = JSON.stringify(this.agenda.innerHTML);
        localStorage['agendaVariable'] = JSON.stringify(this);

        console.log('saved')
    },

    loadAgendaFromCache:function() {
        const storedAgendaHTML = JSON.parse(localStorage['agendaHTML']);
        const storedAgendaVariable = JSON.parse(localStorage['agendaVariable']);

        if (storedAgendaVariable)
        {
            // this = JSON.parse(storedAgendaVariable)
            this.numberOfPages = storedAgendaVariable.numberOfPages;
            this.isLastPage = storedAgendaVariable.isLastPage;
            this.isFirstPage = storedAgendaVariable.isFirstPage;

            this.leftSidePageNumber = storedAgendaVariable.leftSidePageNumber;
            this.leftSidePageIndex = storedAgendaVariable.leftSidePageIndex;

            this.rightSidePageNumber = storedAgendaVariable.rightSidePageNumber;
            this.rightSidePageIndex = storedAgendaVariable.rightSidePageIndex;

            // console.log(storedAgendaVariable);
        }
        if (storedAgendaHTML)
        {
            this.agenda.innerHTML = storedAgendaHTML;
        }

    },

    init: function() {
        this.agenda.addEventListener('transitionend', this.resetFlippingState.bind(this));
        this.agenda.addEventListener('click', this.deleteContact.bind(this), true);
        this.agenda.addEventListener('transitionend', this.saveAgendaToCache.bind(this),true)
    }
};


// Initialize the book object to set up event listeners
book.init();


try {
    /* Load agenda from local storage. And update the pages total and current page display. */
    book.loadAgendaFromCache();
    updateCurrentPageAndTotalPagesDisplay();
}
catch {
    null;
}


const btnFlipBackward = document.getElementsByClassName('btn-flip-backward')[0];
btnFlipBackward.addEventListener('click', () => book.flipPageBackward(), true);

const btnFlipForward = document.getElementsByClassName('btn-flip-forward')[0];
btnFlipForward.addEventListener('click', () => book.flipPageForward(), true);



const btnAddPage = document.getElementsByClassName('btn-add-page')[0];
btnAddPage.addEventListener('click', () => book.addPage(), true);

const btnDeletePage = document.getElementsByClassName('btn-remove-page')[0];
btnDeletePage.addEventListener('click', () => book.deletePage(), true);

const currentPageDisplay = document.getElementById('agenda-current-page');
const inputGoToPage = function(event){
    book.goToPage(event.target.value);
}
currentPageDisplay.addEventListener('change', inputGoToPage, true);

