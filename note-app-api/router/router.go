package router

import (
	// 各環境に合わせてcontrollerをimport
	"net/http"
	"note-app-api/controller"
	"os"

	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func NewRouter(uc controller.IUserController, nc controller.INoteController) *echo.Echo {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		// DefaultCORSConfig = CORSConfig{
		// 	Skipper:      DefaultSkipper,
		// 	AllowOrigins: []string{"*"},
		// 	AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
		// }
		AllowOrigins: []string{"http://localhost:3000", os.Getenv("FE_URL")},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,
			echo.HeaderAccessControlAllowOrigin, echo.HeaderXCSRFToken},
		AllowCredentials: true,
	}))

	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		// DefaultCSRFConfig = CSRFConfig{
		// 	Skipper:      DefaultSkipper,
		// 	TokenLength:  32,
		// 	TokenLookup:  "header:" + echo.HeaderXCSRFToken,
		// 	ContextKey:   "csrf",
		// 	CookieName:   "_csrf",
		// 	CookieMaxAge: 86400,
		// }
		CookiePath:     "/",
		CookieDomain:   os.Getenv("API_DOMAIN"),
		CookieSecure:   true,
		CookieHTTPOnly: true,
		CookieSameSite: http.SameSiteNoneMode, // 稼働用
		// CookieSameSite: http.SameSiteDefaultMode, //PostMan確認用。（SameSiteNoneModeだとSecureが自動でtrueになるため）
	}))

	e.POST("/signup", uc.SignUp)
	e.POST("/login", uc.Login)
	e.POST("/logout", uc.Logout)
	e.GET("/csrf", uc.GetCsrf)

	// ↓↓以降は参考例↓↓
	n := e.Group("/note")
	n.Use(echojwt.WithConfig(echojwt.Config{
		TokenLookup: "cookie:token",
		SigningKey:  []byte(os.Getenv("SECRET")),
	}))
	n.GET("", nc.Read)
	n.POST("", nc.Create)
	n.PUT("/:id", nc.Update)
	n.DELETE("/:id", nc.Delete)

	e.Use(middleware.Logger())
	return e
}
