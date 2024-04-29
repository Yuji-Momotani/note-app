package model

import "time"

type Note struct {
	ID        uint      `json:"id" gorm:"primaryKey"` //intのprimaryKeyを指定することでAuotIncrementも設定される。（GORM）
	Title     string    `json:"title" gorm:"not null;"`
	Content   string    `json:"content"`
	UserID    uint      `json:"user_id" gorm:"not null;"`
	User      User      `json:"user" gorm:"foreignKey:UserID; constraint:OnDelete:CASCADE"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type NoteResponse struct {
	ID        uint      `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	UpdatedAt time.Time `json:"updated_at"`
}
