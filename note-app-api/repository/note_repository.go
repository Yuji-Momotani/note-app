package repository

import (
	// 各環境に合わせてmodelをimportする

	"database/sql"
	"note-app-api/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// インターフェース
type INoteRepository interface {
	GetNote(user_id uint) ([]model.Note, error)
	CreateNote(note *model.Note) error
	UpdateNote(note *model.Note) error
	DeleteNote(note_id uint, user_id uint) error
}

// インターフェースを実装する構造体
type noteRepository struct {
	db *gorm.DB
}

// コンストラクタ
func NewNoteRepository(db *gorm.DB) INoteRepository {
	return &noteRepository{db: db}
}

// 実装部
func (nr *noteRepository) GetNote(user_id uint) ([]model.Note, error) {
	notes := []model.Note{}
	if err := nr.db.Where("user_id = ?", user_id).Order("updated_at desc").Find(&notes).Error; err != nil {
		return nil, err
	}
	return notes, nil
}

func (nr *noteRepository) CreateNote(note *model.Note) error {
	if err := nr.db.Create(note).Error; err != nil {
		return err
	}
	return nil
}

func (nr *noteRepository) UpdateNote(note *model.Note) error {
	result := nr.db.Model(note).Clauses(clause.Returning{}).Where("id = ? AND user_id = ?", note.ID, note.UserID).Updates(map[string]interface{}{
		"title":   note.Title,
		"content": note.Content,
	})

	if rows := result.RowsAffected; rows < 1 {
		return sql.ErrNoRows
	}

	if err := result.Error; err != nil {
		return err
	}

	return nil
}

func (nr *noteRepository) DeleteNote(note_id uint, user_id uint) error {
	note := model.Note{}
	result := nr.db.Where("id = ? AND user_id = ?", note_id, user_id).Delete(&note)
	if err := result.Error; err != nil {
		return err
	}

	if rows := result.RowsAffected; rows < 1 {
		return sql.ErrNoRows
	}
	return nil
}
