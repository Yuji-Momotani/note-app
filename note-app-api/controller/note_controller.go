package controller

import (
	//各環境に合わせてmodelとusecaseをimport
	"database/sql"
	"net/http"
	"note-app-api/model"
	"note-app-api/usecase"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// interface
type INoteController interface {
	Read(c echo.Context) error
	Create(c echo.Context) error
	Update(c echo.Context) error
	Delete(c echo.Context) error
}

// interfaceを実装するstruct
type noteController struct {
	nu usecase.INoteUsecase
}

// コンストラクタ
func NewNoteController(nu usecase.INoteUsecase) INoteController {
	return &noteController{nu: nu}
}

func getUserIdFromJWT(c echo.Context) uint {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	user_id := claims["user_id"].(float64)

	return uint(user_id)
}

func (nc *noteController) Read(c echo.Context) error {
	user_id := getUserIdFromJWT(c)

	notesResponse, err := nc.nu.GetNote(user_id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, notesResponse)
}

func (nc *noteController) Create(c echo.Context) error {
	note := model.Note{}
	if err := c.Bind(&note); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	user_id := getUserIdFromJWT(c)
	note.UserID = user_id

	noteResponse, err := nc.nu.CreateNote(note)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, err)
		}
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, noteResponse)
}

func (nc *noteController) Update(c echo.Context) error {
	note := model.Note{}
	if err := c.Bind(&note); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	user_id := getUserIdFromJWT(c)
	s_note_id := c.Param("id")
	note_id, err := strconv.Atoi(s_note_id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	note.ID = uint(note_id)
	note.UserID = user_id

	noteResponse, err := nc.nu.UpdateNote(note)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, err)
		}
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, noteResponse)
}

func (nc *noteController) Delete(c echo.Context) error {
	user_id := getUserIdFromJWT(c)
	s_note_id := c.Param("id")
	note_id, err := strconv.Atoi(s_note_id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}

	if err := nc.nu.DeleteNote(uint(note_id), user_id); err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusBadRequest, err)
		}
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.NoContent(http.StatusOK)
}
