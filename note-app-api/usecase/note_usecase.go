package usecase

import (
	// 各環境に合わせてmodel、repository、validatorをimportする

	"note-app-api/model"
	"note-app-api/repository"
	"note-app-api/validator"
)

// インターフェース
type INoteUsecase interface {
	GetNote(user_id uint) ([]model.NoteResponse, error)
	CreateNote(note model.Note) (model.NoteResponse, error)
	UpdateNote(note model.Note) (model.NoteResponse, error)
	DeleteNote(note_id uint, user_id uint) error
}

// インターフェースを実装するstruct
type noteUsecase struct {
	nr repository.INoteRepository
	nv validator.INoteValidator
}

// コンストラクタ
func NewNoteUsecase(nr repository.INoteRepository, nv validator.INoteValidator) INoteUsecase {
	return &noteUsecase{nr: nr, nv: nv}
}

// 処理部
func (nu *noteUsecase) GetNote(user_id uint) ([]model.NoteResponse, error) {
	// Repositoryの処理呼び出し
	notes, err := nu.nr.GetNote(user_id)
	if err != nil {
		return nil, err
	}

	// レスポンスの作成
	notesResponse := []model.NoteResponse{}
	for _, v := range notes {
		noteResponse := model.NoteResponse{
			ID:        v.ID,
			Title:     v.Title,
			Content:   v.Content,
			UpdatedAt: v.UpdatedAt,
		}
		notesResponse = append(notesResponse, noteResponse)
	}
	return notesResponse, nil
}

func (nu *noteUsecase) CreateNote(note model.Note) (model.NoteResponse, error) {
	// バリデーション
	if err := nu.nv.NoteValidate(note); err != nil {
		return model.NoteResponse{}, err
	}

	// Repository処理の呼び出し
	if err := nu.nr.CreateNote(&note); err != nil {
		return model.NoteResponse{}, err
	}
	// レスポンスの作成
	noteResponse := model.NoteResponse{
		ID:        note.ID,
		Title:     note.Title,
		Content:   note.Content,
		UpdatedAt: note.UpdatedAt,
	}
	return noteResponse, nil
}

func (nu *noteUsecase) UpdateNote(note model.Note) (model.NoteResponse, error) {
	// バリデーション
	if err := nu.nv.NoteValidate(note); err != nil {
		return model.NoteResponse{}, err
	}

	// Repository処理の呼び出し
	if err := nu.nr.UpdateNote(&note); err != nil {
		return model.NoteResponse{}, err
	}

	// レスポンスの作成
	noteResponse := model.NoteResponse{
		ID:        note.ID,
		Title:     note.Title,
		Content:   note.Content,
		UpdatedAt: note.UpdatedAt,
	}
	return noteResponse, nil
}

func (nu *noteUsecase) DeleteNote(note_id uint, user_id uint) error {
	// Repository処理の呼び出し
	if err := nu.nr.DeleteNote(note_id, user_id); err != nil {
		return err
	}

	// レスポンスの作成
	return nil
}
