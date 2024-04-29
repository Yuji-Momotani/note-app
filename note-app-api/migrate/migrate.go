package main

import (
	"fmt"
	"note-app-api/db"
	"note-app-api/model"
	// 各環境に合わせて、dbとmodelをimport
)

func main() {
	dbConn := db.NewDB()
	defer fmt.Println("Successfully Migrated")
	defer db.CloseDB(dbConn)
	// 例：userとtaskテーブルを作成したい場合
	dbConn.AutoMigrate(&model.User{}, &model.Note{}) //作成したいモデルのstructを0値で引数に渡す
}
