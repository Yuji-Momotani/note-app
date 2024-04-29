package main

import (
	"note-app-api/controller"
	"note-app-api/db"
	"note-app-api/repository"
	"note-app-api/router"
	"note-app-api/usecase"
	"note-app-api/validator"
)

// 各環境に合わせて各層をimport

func main() {
	connectDB := db.NewDB()

	// user
	userValidation := validator.NewUserValidator()
	userRepository := repository.NewUserRepository(connectDB)
	userUsecase := usecase.NewUserUsecase(userRepository, userValidation)
	userController := controller.NewUserController(userUsecase)

	// note
	noteValidation := validator.NewNoteValidator()
	noteRepository := repository.NewNoteRepository(connectDB)
	noteUsecase := usecase.NewNoteUsecase(noteRepository, noteValidation)
	noteController := controller.NewNoteController(noteUsecase)

	// router
	e := router.NewRouter(userController, noteController)
	e.Logger.Fatal(e.Start(":8080"))
}
