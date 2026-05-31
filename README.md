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
- **Regen:** mỗi 24s sinh thêm 7 cặp vào vùng trống (tới 18 đợt, dừng sau giây 200). Tới kỳ regen mà hết chỗ → **thua** (tràn lưới).
- **Đổi hướng gravity:** mỗi đợt regen, hướng dồn đổi sang 1 góc khác (↘ ↙ ↗ ↖) — lưới reshape bất ngờ, có mũi tên báo hướng + 5s telegraph.
- **Ô băng (ice):** một số ô đóng băng (phủ xanh) **không nối được**; tan khi bạn ăn 1 cặp có ô nằm sát nó. Đầu màn ~8 ô, mỗi regen thêm ~2.
- **Auto-shuffle:** khi không còn nước đi mà lưới chưa trống → tan hết băng + tự xáo lại miễn phí.
- **Thắng:** dọn sạch lưới trước khi hết **4 phút**. **Thua:** hết giờ còn ô, hoặc tràn lưới.
- ⚠️ **God Mode:** calibrate (mô phỏng) để chỉ thắng nếu giữ nhịp **~1.5 giây/cặp** suốt màn dưới áp lực regen + đổi hướng + băng.
- Power-up: **Hint** (1 lần), **Shuffle** (1 lần). Điểm: +100/cặp, có combo + thưởng thời gian.
- **High score:** lưu kỷ lục cá nhân (localStorage) — chơi lại để phá kỷ lục của chính mình.

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
