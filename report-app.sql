-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 17, 2024 lúc 10:55 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `report-app`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `phone` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(500) NOT NULL,
  `note` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reports`
--

INSERT INTO `reports` (`id`, `title`, `content`, `created_at`, `status`, `image_path`, `phone`, `name`, `address`, `note`) VALUES
(6, 'Báo Cáo C', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney ', '0000-00-00 00:00:00', 1, 'IMG_20240810_213434.jpg', '0123456789', 'Nguyễn Văn C', 'Cây mít/Gốc đa', 'abcdef note C'),
(7, 'Landmark 81', 'Cảnh đẹp hữu tình', '2024-08-16 09:29:10', 0, 'IMG_20240810_213434.jpg', '0123456789', 'Đào Ngọc Dũng', '123/1234', NULL),
(8, 'Báo cáo A', 'Lý do A', '2024-08-16 16:03:21', 0, 'IMG_20240812_003724.jpg', '0123456789', 'Nguyễn Văn A', '1/2/Thạnh Xuân/Quận 2', NULL),
(9, 'Báo cáo B', 'Lý do B', '2024-08-16 16:05:39', 0, 'IMG_20240723_100903.jpg', '0987654321', 'Nguyễn Văn B', '23/56/thạnh lộc/Quận 3', NULL),
(10, 'Báo Cáo D', 'Lý do D', '2024-08-17 04:53:53', 0, 'IMG_20240712_183611.jpg', '0987654321', 'Nguyễn Văn D', '41/17/cây tre/cây trúc', NULL),
(11, 'Báo Cáo C', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney ', '2024-08-17 10:15:39', 0, '', '0123456789', 'Nguyễn Văn C', 'Cây mít/Gốc đa', NULL),
(12, 'Báo Cáo E ', 'Lý do E', '2024-08-17 11:29:51', 1, 'IMG_20240708_175745.jpg', '0987654321', 'Nguyễn Văn E', '123/321/123/124', 'Oke đấy');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `ward` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `ward`) VALUES
(1, 'ward1@example.com', 'e10adc3949ba59abbe56e057f20f883e', '1'),
(2, 'ward2@example.com', 'e10adc3949ba59abbe56e057f20f883e', '2'),
(3, 'ward3@example.com', 'e10adc3949ba59abbe56e057f20f883e', '3');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
