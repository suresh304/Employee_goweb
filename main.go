package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type Emp struct {
	Id              int    `json:"id"`
	Employee_name   string `json:"employee_name"`
	Employee_salary int    `json:"employee_salary"`
	Employee_age    int    `json:"employee_age"`
	Profile_image   string `json:"profile_image"`
}
type Data struct {
	Status string `json:"status"`
	Data   []Emp `json:"data"`
	Message string `json:"message"`
}

func main() {
	fmt.Println("hello")
	res, err := http.Get("https://dummy.restapiexample.com/api/v1/employees")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("hello")

	defer res.Body.Close()
	fmt.Println("hello",res.StatusCode)

	if res.StatusCode == http.StatusOK {
		bodyBytes, err := io.ReadAll(res.Body)
		if err != nil {
			fmt.Println("this is err")
			log.Fatal(err)
		}
		testdata := Data{}
	fmt.Println("hello")

		err = json.Unmarshal(bodyBytes, &testdata)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("this is unmarshalled data %+v ", testdata)
	}

	// newData := Data{}

}
