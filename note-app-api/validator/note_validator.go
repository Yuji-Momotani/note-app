package validator

import (
	// 各環境に合わせてmodelをimportする

	"note-app-api/model"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

type INoteValidator interface {
	NoteValidate(note model.Note) error
}

type noteValidator struct{}

func NewNoteValidator() INoteValidator {
	return &noteValidator{}
}

func (uv *noteValidator) NoteValidate(note model.Note) error {
	return validation.ValidateStruct(&note,
		validation.Field(
			&note.Title,
			validation.Required.Error("title is required"),
			validation.RuneLength(1, 50).Error("limited max 50 char"),
		),
		validation.Field(
			&note.Content,
			validation.RuneLength(0, 5000).Error("limited max 5000 char"),
		),
		validation.Field(
			&note.UserID,
			validation.Required.Error("user_id is required"),
		),
	)
}
