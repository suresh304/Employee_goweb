package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

type Emp struct {
	Id             int64  `json:"id"`
	EmployeeName   string `json:"employee_name"`
	EmployeeSalary int64  `json:"employee_salary"`
	EmployeeAge    int64  `json:"employee_age"`
}

var employees []Emp

func main() {
	loadEmployeesFromFile()

	http.HandleFunc("/employees", enableCORS(getEmployee))
	http.HandleFunc("/add", enableCORS(addEmployee))
	http.HandleFunc("/delete/", enableCORS(deleteEmployee))
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func loadEmployeesFromFile() {
	file, err := os.Open("../data.json")
	if err != nil {
		log.Fatal("Error opening data.json:", err)
	}
	defer file.Close()
	fmt.Println("employee data.json filee",file)

	decoder := json.NewDecoder(file)
	fmt.Println("decoder",decoder)

	err = decoder.Decode(&employees)
	if err != nil {
		log.Fatal("Error decoding data from data.json:", err)
	}
}



func getEmployee(w http.ResponseWriter, r *http.Request) {
	// Set the response content type
	w.Header().Set("Content-Type", "application/json")

	// Encode and send the employees as JSON response
	json.NewEncoder(w).Encode(employees)
}




func addEmployee(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hello this is " ,r.Body)
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON data from the request body into a new Employee
	var newEmployee Emp
	err := json.NewDecoder(r.Body).Decode(&newEmployee)
	if err != nil {
		http.Error(w, "Error decoding JSON data", http.StatusBadRequest)
		return
	}

	// Generate a unique ID for the new employee
	// newEmployee.ID = generateID()

	// Add the new employee to the slice
	employees = append(employees, newEmployee)

	// Save the updated employees slice to the data.json file
	saveEmployeesToFile()

	// Set the response content type
	w.Header().Set("Content-Type", "application/json")

	// Set the HTTP status code to 201 (Created) to indicate success
	w.WriteHeader(http.StatusCreated)

	// Encode the newEmployee struct as JSON and send it in the response body
	json.NewEncoder(w).Encode(newEmployee)
}


func deleteEmployee(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
fmt.Println("helloo delete")
	// Extract employee ID from request parameters or body
	parts := strings.Split(r.URL.Path, "/")
    if len(parts) < 3 {
        http.Error(w, "Missing employee ID parameter", http.StatusBadRequest)
        return
    }

    idStr := parts[2]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid employee ID format", http.StatusBadRequest)
        return
    }

	// Find and remove the employee with the specified ID
	index := -1
	for i, emp := range employees {
		if int(emp.Id) == id {
			index = i
			break
		}
	}

	if index == -1 {
		http.Error(w, "Employee not found", http.StatusNotFound)
		return
	}

	// Remove the employee from the slice
	employees = append(employees[:index], employees[index+1:]...)

	// Save the updated data back to the "data.json" file
	saveEmployeesToFile()

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Employee with ID %d deleted successfully", id)
}

func saveEmployeesToFile() {
	// Open the data.json file for writing
	file, err := os.Create("../data.json")
	if err != nil {
		log.Fatal("Error creating data.json:", err)
	}
	defer file.Close()

	// Encode the employees slice as JSON and write it to the file
	encoder := json.NewEncoder(file)
	err = encoder.Encode(employees)
	if err != nil {
		log.Fatal("Error encoding and writing data to data.json:", err)
	}
}



func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST,DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// If it's an OPTIONS request, send an empty response with status code 200
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler in the chain
		next.ServeHTTP(w, r)
	}
}
