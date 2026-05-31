# God Mode — Pikachu Nối Hình (Boss)

Web game nối hình (Onet/Pikachu) độ khó **Boss**, 1 màn, chơi được trên desktop và iPad (cảm ứng). Render bằng HTML5 Canvas, không cần build.

## Chơi thử

Cần chạy qua HTTP (game tải sprite + `game-core.js`), **không** mở trực tiếp bằng `file://`.

```bash
# từ thư mục gốc dự án
python3 -m http.server 8000
# rồi mở http://localhost:8000  (tự chuyển vào UI/)
```

Hoặc serve thẳng thư mục `UI/`.

## Luật & cơ chế

- Lưới **16×12 = 192 ô (96 cặp)**, 24 loại đồ ăn, ban đầu kín hoàn toàn.
- Nối 2 ô cùng hình bằng đường **≤ 3 đoạn thẳng** (≤ 2 lần gấp khúc), đi qua ô trống hoặc **vành ngoài lưới**.
- **Gravity kép:** sau mỗi lần ăn, các ô dồn xuống rồi sang phải (về góc dưới-phải).
- **Regen:** mỗi 45s sinh thêm 6 cặp vào vùng trống (cap 6 đợt, dừng sau giây 360). Tới kỳ regen mà hết chỗ → **thua** (tràn lưới).
- **Auto-shuffle:** khi không còn nước đi mà lưới chưa trống, tự xáo lại miễn phí.
- **Thắng:** dọn sạch lưới trước khi hết 8 phút. **Thua:** hết giờ còn ô, hoặc tràn lưới.
- Power-up: **Hint** (1 lần), **Shuffle** (1 lần). Điểm: +100/cặp, có combo + thưởng thời gian.

Chi tiết spec: [`PRD_Pikachu_Boss_Round.md`](PRD_Pikachu_Boss_Round.md).

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `UI/index.html` | Game (Canvas + vòng lặp + input + render) |
| `UI/game-core.js` | Logic thuần (findPath, gravity, solver, shuffle…) — dùng chung trình duyệt & Node |
| `UI/game-core.test.js` | Test cho logic (`node --test`) |
| `UI/sprites/` | Icon đồ ăn |
| `index.html` | Redirect vào `UI/` |
| `PRD_Pikachu_Boss_Round.md` | Tài liệu đặc tả |

## Test

```bash
cd UI && node --test
```
