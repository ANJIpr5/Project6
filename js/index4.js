afficheButtonAjouterLivre();

// definition  of the function line is 3. Line 1 is unitilization of function//
function afficheButtonAjouterLivre(){
    // Check if the container exists
    let maPocheListeContainer = document.getElementById("maPocheListeContainer");

    if (!maPocheListeContainer) {
        maPocheListeContainer = document.createElement("div");
        maPocheListeContainer.id = "maPocheListeContainer";

    }

    // Create the 'h2' element
    const maPochListeHeading = document.createElement("h2");
    maPochListeHeading.textContent = "Ma Poch'Liste";

    // Append the 'h2' element to the container
    maPocheListeContainer.appendChild(maPochListeHeading);

    // Append the maPocheListe to the container
    //maPocheListeContainer.appendChild(maPocheListe);

    // Set the container to flex and arrange its children in a column
    maPocheListeContainer.style.display = "flex";
    maPocheListeContainer.style.flexDirection = "column";

     // Move the container to the bottom of the body
     document.body.appendChild(maPocheListeContainer);

    //end
    //construct element
    let button = createButton("AJOUTER UN LIVRE","Ajouter-Livre-Button","ajouter-button");
    button.addEventListener("click",function(event){  
        
        let searchForm = createSearchForm ("searchForm","search-form");

        // Move "Ma poche liste" section to the bottom of the body
        document.body.appendChild(maPocheListe);
        

        // Append "Ma poch'liste" text below the centeredText element
        const centeredText = document.getElementById("centeredText");
        
        centeredText.parentNode.insertBefore(maPocheListe, centeredText.nextSibling);
        
        //making the form appear
        let divMyBooks = document.getElementById("myBooks");
        divMyBooks.appendChild (searchForm);
        
        searchForm.style.display = "Block";   //showing the form

       
        let maPocheListeText = document.getElementById("content");
        
        document.body.appendChild(maPocheListe);
        



        if (maPocheListeText) {
            document.body.appendChild(content);
            content.style.display = "none";      
        }


        

        displayBookmarkedBooks(); //DISPLAYING BOOKMARKED LIST CONSTANTLY?
        
        button.style.display = "none"; // Hide the "Ajouter Un Livre" button
        //document.divMyBooks.appendChild(maPocheListe);
        
    });
    
    
    let divMyBooks = document.getElementById ("myBooks");
    var hr = document.querySelector ("hr");
    
    hr.parentNode.insertBefore (button,hr);
    //var maPocheListe = document.getElementById ("maPocheList");
   // maPocheListe.parentNode.insertBefore(searchForm, maPocheListe.nextSibling);
}


//to create the "AJOUTER UN  LIVRE" button dynamically (for the original gree button)//
function createButton(text,id,className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    button.className = className;
    return button;   
};


 //function To make the search form dynamic//
 function createSearchForm () {
    const searchForm = document.createElement("form");
    searchForm.id = "searchForm";
    searchForm.className = "search-form";
    searchForm.style.display ="none";

    const titreInput = createInput("TITRE DU LIVRE","titre-du-livre","text", true);
    const auteurInput = createInput("AUTEUR","auteur","text", true);

    const rechercherButton = createButton("RECHERCHER", "rechercher", "rechercher-button");
    const annulerButton = createButton("ANNULER", "annuler","annuler-button");
    


    searchForm.appendChild(titreInput);
    searchForm.appendChild(auteurInput);
    searchForm.appendChild(rechercherButton);
    searchForm.appendChild(annulerButton);
    

    //modifying the "rechercher" listener//
    rechercherButton.addEventListener("click", function(event){
        event.preventDefault();
        
        const titre = document.getElementById("titre-du-livre").value;
        const auteur = document.getElementById("auteur").value;
        console.log ("Searching for The Book");
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titre + " " + auteur)}&key=${"AIzaSyDfwrwQrF1U1GXA7Z2vMTKHICvTLhBlheM"}`;
        


        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titre + " " + auteur)}&key=${"AIzaSyDfwrwQrF1U1GXA7Z2vMTKHICvTLhBlheM"}`)
            .then(response => response.json())
            .then(data => {
                console.log (data)
                
                displaySearchResults(data);
                
                console.log ("Have We found The Book?");
                
    })
    

            .catch(error => {
        // deal with any errors or display an error message to the user
                console.error("API Request Error:", error);
                
    
            });        
        });
           
//handling the "ANNULER" button
    annulerButton.addEventListener("click",function () {
        //show the "annuler" button//
        const ajouterButton = document.getElementById("Ajouter-Livre-Button");
        if (ajouterButton){
        ajouterButton.style.display = "block";
        }
        const myBooks = document.getElementById("myBooks");
        const searchForm = document.getElementById("searchForm");
        //remove search form//
        if (myBooks && searchForm){
            myBooks.removeChild(searchForm);
        }
        // Move "Ma Poch' Liste" back to the bottom of the body
       // document.body.appendChild(maPocheListe);
        
        hideSearchResults();
    });

    return searchForm;

 }

 // + to create input dynamically//
 function createInput(placeholder, id, type, required){
    const input = document.createElement("input");
    input.placeholder = placeholder;
    input.id =id;
    input.type = type;
    input.required = required;
    return input;
 }

 // + function to hide search results//
function hideSearchResults() {
    // hide search form?
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.style.display = "none";
    }

    const searchResults = document.getElementById("search-Results");
    if (searchResults){ 
    searchResults.innerHTML = "<p>NO RESULTS FOUND.</p>";
    searchResults.style.display = "none";
    }
}

function getOrCreateSearchResultSection(){
    const searchResults = document.getElementById("search-Results");
    if (searchResults == null){
        const section = document.createElement ("section");
        section.id = "search-Results";
       
        const searchForm = document.getElementById("searchForm");

        //insert section?//
        searchForm.insertAdjacentElement("afterend", section);

        return section;

        //TO DO: create the section below form then display results IN section//

    } else {
        return searchResults;
    }
    
}

let bookmarkedBooks = JSON.parse(sessionStorage.getItem('bookmarkedBook')) || [];//overwriting the session storage each time we bookmark a new book. .make sure that bookmarkedBooks is defined globally. 



function bookmarkBook (identifier, title, author, description, imageLink){
    const bookInfo = {
        identifier: identifier,
        title: title,
        author: author,
        description: description,
        imageLink: imageLink
    };
    bookmarkedBooks.push(bookInfo);
    // Update session storage with the updated array
    updateSessionStorage();

    console.log(`Book with identifier ${identifier} bookmarked`);
    displayBookmarkedBooks();
}
function updateSessionStorage() {
    // Update session storage with the current bookmarkedBooks array
    sessionStorage.setItem('bookmarkedBook',JSON.stringify(bookmarkedBooks)); 
}
   

let deleteContainer; 

function displaySearchResults(data) {
    console.log("Displaying search results. Clearing previous results.");
    const searchResultsSection = getOrCreateSearchResultSection();

    searchResultsSection.innerHTML = ""; //Empty the search results

    
        if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
            const bookInfo = item.volumeInfo;
            const title = bookInfo.title;
            const author = bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown Author";
            const identifier = item.id; //identifier?
            
        //displaying book image??//
            const imageLink = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : ",";

            const bookResult = document.createElement("div");
            bookResult.classList.add("book-result");

            //making the bookmark icon clickable
            const bookmarkIcon = document.createElement("span");
            bookmarkIcon.className = "bookmark-icon fas fa-bookmark";
            bookmarkIcon.onclick = function() {
                bookmarkBook(identifier, title, author, bookInfo.description, imageLink);
            };
            

            //book mark container?
            const bookmarkContainer = document.createElement("span");
            bookmarkContainer.className = "bookmark-icon";
            bookmarkContainer.innerHTML = "&#128278;";


//making the bookmark clickable?
            bookmarkContainer.onclick = function() {
                bookmarkBook(identifier, title, author, bookInfo.description, imageLink);

            };


            bookResult.appendChild(bookmarkContainer);
            
            bookResult.innerHTML = `<h3>${title}</h3><p>Author: ${author}</p><p>Identifier: ${identifier}</p>`; //display idententifier?

            const bookDescription = document.createElement("p");

            if (bookInfo.description !=null && bookInfo.description.length > 200) {
                
             bookInfo.description = bookInfo.description.substring(0,200);}

             if (bookInfo.description){
             bookDescription.innerHTML = bookInfo.description;

            } else {
                bookDescription.innerHTML = "INFORMATION IS MISSING";
                bookDescription.classList.add("information-missing");
            }
             bookResult.appendChild(bookDescription);
        

        // the bookcover//
            bookResult.appendChild(bookmarkContainer); //book result only for search results ?
            const bookCover = document.createElement("img");
            bookCover.src = imageLink;
            bookCover.alt = `${title} Cover`;
            bookCover.classList.add("book-cover");
            bookResult.appendChild(bookCover);

            // Add an event listener for error handling
            bookCover.addEventListener("error", function() {
    // If the image fails to load, set a fallback image
                bookCover.src = "https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Salesforce_P1_FR/unavailable.png";
            });
            bookResult.appendChild(bookmarkIcon); // Replace the old bookmark container with the new bookmark icon
            bookResult.appendChild(bookCover);


//delete button?
           
            deleteContainer = document.createElement("span");
            deleteContainer.className = "delete-icon delete-icon-search";
            deleteContainer.innerHTML = "&#128465;"; // Unicode for bin icon
            deleteContainer.style.marginRight = "15px";


    // Making the delete button clickable
            deleteContainer.onclick = function() {
                deleteBookFromList(identifier);
            };

            bookResult.appendChild(deleteContainer);
            searchResultsSection.appendChild(bookResult);       
        });

        //searchResultsSection.style.display = "block";

         // Move the "Ma poch'liste" section to the bottom of the body
    const maPocheListe = document.getElementById("content");
    if (maPocheListe) {
        document.body.appendChild(maPocheListe);
        }  
    } else {
        // Handle the case when there are no results
        console.error("Search form not found");
        searchResultsSection.innerHTML = "<p>AUCUN LIVRE N'A ÉTÉ TROUVÉ</p>";
        searchResultsSection.style.display = "block";
    }
   
} 


let maPocheListe = document.getElementById("maPocheListe");

// Check if the section exists
if (!maPocheListe) {
    maPocheListe = document.createElement("maPocheListe");
    maPocheListe.id = "maPocheListe";

    // Move the section to the bottom of the body
    document.body.appendChild(maPocheListe);
    
}
displayBookmarkedBooks();

// Dynamically add Font Awesome library
const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
document.head.appendChild(fontAwesomeLink);


// fix poch listing : make appear 2) storage sesssion3) Have ma poch list text appear before form appears

function createBookElement(book, isBookmarked) {
    const pocheListe = document.getElementById("maPocheListe");
    const bookElement = document.createElement("div");

    bookElement.classList.add("book-result","bookmarked");
    pocheListe.appendChild(bookElement);

    // Create elements for book details
    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("p");
    authorElement.textContent = `Author: ${book.author}`;

    const identifierElement = document.createElement("p");
    identifierElement.textContent = `Identifier: ${book.identifier}`;

    // Create element for book description
    const descriptionElement = document.createElement("p");
    if (book.description) {
        descriptionElement.textContent = book.description;
    } else {
        descriptionElement.textContent = "INFORMATION IS MISSING";
        descriptionElement.classList.add("information-missing");
    }
    // Create element for book cover
    const coverElement = document.createElement("img");
    //coverElement.src = book.imageLink ? book.imageLink : "https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Salesforce_P1_FR/unavailable.png";
    coverElement.src = book.imageLink || "https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Salesforce_P1_FR/unavailable.png";
   
    coverElement.alt = `${book.title} Cover`;
    coverElement.classList.add("book-cover");

    // Add an event listener for error handling
coverElement.addEventListener("error", function() {
    // If the image fails to load, set a fallback image
    coverElement.src = "https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/Salesforce_P1_FR/unavailable.png";
});

    // Append details to the book element
    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(identifierElement);
    bookElement.appendChild(descriptionElement);
    bookElement.appendChild(coverElement);

    if (isBookmarked) {
        const deleteIcon = createDeleteIcon(book); // Pass book as a parameter
        
        
        
       // const deleteIcon = document.createElement("span");
       
       // deleteIcon.className = "delete-icon";
        //deleteIcon.innerHTML = "&#128465;";// Unicode for bin icon


        //deleteIcon.style.marginRight = "20px";

        // Append the bookmark icon to the book element
        //bookElement.appendChild(bookmarkIcon);


       // deleteIcon.onclick = function() {
           // deleteBookFromList(book.identifier);
       // };
        bookElement.appendChild(deleteIcon);
    }
    // Append book element to the maPocheListe
    pocheListe.appendChild(bookElement);
    
    return bookElement;
}



function createDeleteIcon(book) {
    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon fas fa-trash-alt";

    // Additional styling if needed
    deleteIcon.style.color = "#ee00ff"; // Set the color
    deleteIcon.style.cursor = "pointer"; // Optional: Add a pointer cursor for better UX
    // Add a click event listener if you want it to be clickable
    deleteIcon.addEventListener("click", function() {
        deleteBookFromList(book.identifier);
        
        // For example: deleteBookFromList(identifier);
    });

    return deleteIcon;
}

//function createBookmarkIcon(book) {
   // const bookmarkIcon = document.createElement("span");
  //  bookmarkIcon.className = "fas fa-bookmark";
  //  bookmarkIcon.style.color = "#ee00ff";
   // bookmarkIcon.style.cursor = "pointer";

   // bookmarkIcon.addEventListener("click",function(){
   //     addBookToList(book.identifier);

  //  });
//}



function displayBookmarkedBooks() {
    const pocheListe = document.getElementById("maPocheListe");
    pocheListe.innerHTML = ""; // Clear existing content

    bookmarkedBooks.forEach(book => {
        const bookElement = createBookElement(book, true);

          // Create delete icon for bookmarks
          const deleteIcon = document.createElement("span");
          deleteIcon.className = "delete-icon";

          
  
          // Making the delete icon clickable
          deleteIcon.onclick = function() {
              deleteBookFromList(book.identifier);
          };
           // Append delete icon to the book element
        bookElement.appendChild(deleteIcon);

        // Append book element to the maPocheListe
        pocheListe.appendChild(bookElement);
    });
    // Move the "Ma Poch' Liste" section to the bottom of the body after updating content
   // document.body.appendChild(pocheListe);
    //maPocheListe.style.display = "block";

    // Display the "Ma Poch' Liste" section only if there are bookmarked books
    if (bookmarkedBooks.length > 0) {
        pocheListe.style.display = "flex";
        content.style.display = "none";
         //Resoposible for display of poche liste
        // Move the "Ma Poch' Liste" section to the bottom of the body after updating content
        document.body.appendChild(pocheListe);
    } else {
        pocheListe.style.display = "none";
    }
}

function deleteBookFromList(identifier) {
    const indexToDelete = bookmarkedBooks.findIndex(book => book.identifier === identifier);

    if (indexToDelete !== -1) {
        bookmarkedBooks.splice(indexToDelete, 1);
        // Update session storage after deletion
        updateSessionStorage();

    // Implement logic to delete the book from the list
    console.log(`Book with identifier ${identifier} deleted from the list`);
    displayBookmarkedBooks(); // Update the UI after deletion

    } else {
        console.warn(`Book with identifier ${identifier} not found in the list`);
    }
    
}



//to do: NO AVAILABLE IMAGE done:   2. Ma poch liste after rechercher button
//upoad to git and Open classroon


