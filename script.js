document.addEventListener("DOMContentLoaded", function() {
    var employeeDetails = [];

    function updateLivePreview() {
        var name = document.getElementById("name").value || "N/A";
        var jobTitle = document.getElementById("job-title").value || "N/A";
        var collegeName = document.getElementById("college-name").value || "N/A";
        var textColor = document.getElementById("text-color").value || "#000000";
        var fontFamily = document.getElementById("font-family").value || "Arial";
        var photo = document.getElementById("photo").files[0];
        var photoPreview = document.getElementById("preview-photo");
        var previewName = document.getElementById("preview-name");
        var previewJobTitle = document.getElementById("preview-job-title");
        var previewCollegeName = document.getElementById("preview-college-name");

        if (previewName) {
            previewName.textContent = name;
            previewName.style.color = textColor;
            previewName.style.fontFamily = fontFamily;
        }
        if (previewJobTitle) {
            previewJobTitle.textContent = jobTitle;
            previewJobTitle.style.color = textColor;
            previewJobTitle.style.fontFamily = fontFamily;
        }
        if (previewCollegeName) {
            previewCollegeName.textContent = collegeName;
            previewCollegeName.style.color = textColor;
            previewCollegeName.style.fontFamily = fontFamily;
        }

        if (photo) {
            var reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
            };
            reader.readAsDataURL(photo);
        } else {
            photoPreview.src = ""; 
        }
    }

    document.getElementById("name").addEventListener("input", updateLivePreview);
    document.getElementById("job-title").addEventListener("input", updateLivePreview);
    document.getElementById("college-name").addEventListener("input", updateLivePreview);
    document.getElementById("text-color").addEventListener("input", updateLivePreview);
    document.getElementById("font-family").addEventListener("input", updateLivePreview);
    document.getElementById("photo").addEventListener("change", updateLivePreview);

    document.getElementById("generate-output").addEventListener("click", function() {
        var name = document.getElementById("name").value;
        var jobTitle = document.getElementById("job-title").value;
        var collegeName = document.getElementById("college-name").value;
        var textColor = document.getElementById("text-color").value;
        var fontFamily = document.getElementById("font-family").value;
        var photo = document.getElementById("photo").files[0]; 

        var employee = {
            name: name,
            jobTitle: jobTitle,
            collegeName: collegeName,
            textColor: textColor,
            fontFamily: fontFamily,
            photo: photo
        };

        employeeDetails.push(employee);

        document.getElementById("name").value = "";
        document.getElementById("job-title").value = "";
        document.getElementById("college-name").value = "";
        document.getElementById("text-color").value = "#000000";
        document.getElementById("font-family").value = "Arial";
        document.getElementById("photo").value = "";

        clearLivePreview();

        updateEmployeeDetails();

        generatePDF(employee);
    });

    function clearLivePreview() {
        var photoPreview = document.getElementById("preview-photo");
        var previewName = document.getElementById("preview-name");
        var previewJobTitle = document.getElementById("preview-job-title");
        var previewCollegeName = document.getElementById("preview-college-name");

        if (photoPreview) {
            photoPreview.src = ""; 
        }
        if (previewName) {
            previewName.textContent = "N/A";
            previewName.style.color = "#000000";
            previewName.style.fontFamily = "Arial";
        }
        if (previewJobTitle) {
            previewJobTitle.textContent = "N/A";
            previewJobTitle.style.color = "#000000";
            previewJobTitle.style.fontFamily = "Arial";
        }
        if (previewCollegeName) {
            previewCollegeName.textContent = "N/A";
            previewCollegeName.style.color = "#000000";
            previewCollegeName.style.fontFamily = "Arial";
        }
    }

    function updateEmployeeDetails() {
        var employeeList = document.querySelector(".employee-list");

        employeeList.innerHTML = "";

        employeeDetails.forEach(function(employee, index) {
            var employeeCard = document.createElement("div");
            employeeCard.classList.add("id-card1");

            var photoDiv = document.createElement("div");
            photoDiv.classList.add("photo");
            var img = document.createElement("img");
            img.src = URL.createObjectURL(employee.photo);
            img.alt = "Employee Photo";
            img.classList.add("photo");
            photoDiv.appendChild(img);

            var detailsDiv = document.createElement("div");
            detailsDiv.classList.add("details");
            var nameHeading = document.createElement("h3");
            nameHeading.classList.add("name");
            nameHeading.textContent = employee.name;
            nameHeading.style.color = employee.textColor;
            nameHeading.style.fontFamily = employee.fontFamily;
            var jobTitlePara = document.createElement("p");
            jobTitlePara.classList.add("job-title");
            jobTitlePara.textContent = employee.jobTitle;
            jobTitlePara.style.color = employee.textColor;
            jobTitlePara.style.fontFamily = employee.fontFamily;
            var collegeNamePara = document.createElement("p");
            collegeNamePara.classList.add("college-name");
            collegeNamePara.textContent = employee.collegeName;
            collegeNamePara.style.color = employee.textColor;
            collegeNamePara.style.fontFamily = employee.fontFamily;
            detailsDiv.appendChild(nameHeading);
            detailsDiv.appendChild(jobTitlePara);
            detailsDiv.appendChild(collegeNamePara);

            employeeCard.appendChild(photoDiv);
            employeeCard.appendChild(detailsDiv);

            employeeList.appendChild(employeeCard);
        });
    }

    function generatePDF(employee) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [250, 400] 
        });

        pdf.setFillColor(255, 255, 255); 
        pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

        pdf.setFontSize(18);
        pdf.setTextColor(employee.textColor);
        pdf.setFont(employee.fontFamily);
        pdf.text(`Name: ${employee.name}`, 20, 30);
        pdf.text(`Job Title: ${employee.jobTitle}`, 20, 60);
        pdf.text(`College: ${employee.collegeName}`, 20, 90);

        if (employee.photo) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var imgData = e.target.result;
                var photoXPosition = pdf.internal.pageSize.getWidth() - 120; 
                pdf.addImage(imgData, 'JPEG', photoXPosition, 30, 100, 100); 

                pdf.setDrawColor(0);
                pdf.setLineWidth(2);
                pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);

                pdf.save(`${employee.name}.pdf`);
            };
            reader.readAsDataURL(employee.photo);
        } else {
            pdf.setDrawColor(0);
            pdf.setLineWidth(2);
            pdf.rect(10, 10, pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 20);

            pdf.save(`${employee.name}.pdf`);
        }
    }
});
