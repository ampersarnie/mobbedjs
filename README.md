#mobbed.js
One of the issues we face as web designers and developers is the management of certain assets under certain situations. We work hard, we create new methods and progress our abilities to create an accessible internet. One of our current methods for this accessibility is responsive design giving mobile users a better, more appropriate option for their website visits. However, one issue we continue to face is a great limitation with responding to mobile networks. Despite how much we hope for it, it's difficult to create a website that can effectively respond to that limitation.
I created the mobbed.js prototype to help give designers and developers an option to detect mobile networks and assign their assets accordingly.
###What does it do?
Mobile networks can be slow and cumbersome, making loading websites in mobile browsers to be time consuming and sometimes painful experience. mobbed.js estimates the users download speed by downloading the header of itself, timing it and assigning any assets a post-fix depending on the type of network they're using. This could either mean 3G, EDGE or GPRS.
###How does really help?
I'm glad you asked. If we have assets with a prefixed file, that means those files can be defined as we wish. For example, we may have an image that is 500kb for desktop users, and a prefixed, based on mobbed.js' calculations, 200kb compressed image for mobile users on a 3G network. This means that loading times will been much quicker for the mobile user than it would be if they were to download the original image. This will help create a better web experience for mobile users.
###Notes
Unfortunately, due to commitments and lack of time, mobbed.js is a perpetual working prototype state. It works, but as of writing this I have no intentions of going back to it. However, that does not mean all is lost. The prototype is open-source and has been placed on github for anyone to use and/or modify.

###Documentation
Documentation for mobbed.js [can be found here](http://ampersandwich.co.uk/projects/mobbed.js)
