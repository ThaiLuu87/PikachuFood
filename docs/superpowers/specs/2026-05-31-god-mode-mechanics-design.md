# God Mode — cơ chế bổ sung: đổi hướng gravity + ô băng

Ngày: 2026-05-31. Bổ sung 2 cơ chế tăng khó & bất ngờ cho màn God Mode (Pikachu Food).

## 1. Đổi hướng gravity (theo đợt regen)

- `gravityDir` = {dy, dx}, bắt đầu xuống-phải `{dy:1, dx:1}`. 4 hướng: dy∈{±1}, dx∈{±1}.
- Mỗi chu kỳ regen, **5 giây trước khi sinh ô** (đầu cửa sổ cảnh báo), đổi `gravityDir` sang 1 trong 3 hướng còn lại (ngẫu nhiên) và **dồn lại toàn lưới ngay** theo hướng mới (board reshape — đây là cú bất ngờ, được telegraph bằng mũi tên đổi + đếm ngược 5s).
- Giữa các đợt: mọi lần ăn cặp dồn theo `gravityDir` hiện tại.
- Ô regen sinh ở **góc trống đối diện** góc dồn (open corner). 5s cảnh báo highlight đúng các ô open-corner sắp bị lấp (nhất quán vì đã flip trước).
- HUD: mũi tên (↘ ↙ ↗ ↖) chỉ hướng dồn hiện tại.

## 2. Ô băng (ice)

- `frozen[r][c]` boolean song song với `board`. Ô băng **không chọn/nối được**; vẽ lớp phủ băng.
- **Tan** khi ăn 1 cặp có ô nằm orthogonal-adjacent (trên/dưới/trái/phải) ô băng → `frozen=false` (tính tại thời điểm xoá cặp, theo vị trí trước gravity).
- Ban đầu đóng băng ~10 ô; mỗi đợt regen đóng băng ~2 ô mới.
- Băng di chuyển theo gravity/shuffle cùng tile (mang theo cờ frozen).
- **Chống kẹt:** nếu không còn cặp (không-băng) nào nối được → tan hết băng; nếu vẫn kẹt → auto-shuffle. Đảm bảo luôn thắng được.

## 3. Kỹ thuật (logic thuần + test)

- `GameCore.applyGravity(grid, rows, cols, dir?)` — `dir` optional, mặc định xuống-phải. Pack dọc theo dy rồi ngang theo dx.
- `GameCore.hasAnyMove(grid, rows, cols, frozen?)` và `findHint(..., frozen?)` — bỏ qua ô băng.
- `findPath` giữ nguyên (ô băng là ô chiếm chỗ → tự chặn đường).
- Gravity/shuffle ở UI mang theo `frozen` (frozen đi cùng tile).
- Test mới: gravity 4 hướng; hasAnyMove/findHint khi có frozen.

## 4. Re-calibrate

Băng + đổi hướng tăng khó → chạy lại harness mô phỏng (frozen-aware, dir-aware), nới nhẹ thời gian/regen nếu cần để giữ mức "chuyên gia thắng sát nút", không bất khả thi.
