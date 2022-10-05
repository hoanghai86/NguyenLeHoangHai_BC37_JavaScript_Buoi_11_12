var userList = [];

//hàm có chức năng in sinh viên ra màn hình
//tạo HTML trong javascript
function renderUser(data) {
  //nếu không truyền mảng data nào thì ta gán mặc định là mảng userList
  if (!data) data = userList;
  var tableHTML = "";
  for (var i = 0; i < data.length; i++) {
    var currentUser = data[i];
    tableHTML += `<tr>
    <td>${currentUser.id}</td>
    <td>${currentUser.taiKhoan}</td>
    <td>${currentUser.matKhau}</td>
    <td>${currentUser.hoTen}</td>
    <td>${currentUser.email}</td>
    <td>${currentUser.ngonNgu}</td>
    <td>${currentUser.loaiND}</td>
    <td><button class = "btn btn-danger" onclick="deleteUser('${currentUser.id}')">Xóa</button>
    <button class = "btn btn-info" data-toggle="modal"
    data-target="#myModal" onclick="getUpdateUser('${currentUser.id}')">Sửa</button></td>
    </tr>`;
  }
  document.getElementById("tblDanhSachNguoiDung").innerHTML = tableHTML;
}

//hàm có chức năng lấy danh sách sinh viên lên giao diện
function getUserList() {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User",
    method: "GET",
  })
    .then(function (res) {
      userList = res.data;
      renderUser();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//Hàm có chức năng thêm sinh viên vào database
function createUser() {
  //Lấy thông tin người dùng nhập vô
  var taiKhoan = document.getElementById("TaiKhoan").value;
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;
  var hinhAnh = document.getElementById("HinhAnh").value;

  //tạo 1 object đối tượng sinh viên
  var newUser = new User(
    taiKhoan,
    hoTen,
    matKhau,
    email,
    loaiND,
    ngonNgu,
    moTa,
    hinhAnh
  );

  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User",
    method: "POST",
    data: newUser,
  })
    .then(function (res) {
      getUserList();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng xóa user trong danh sách, có dấu "/"
function deleteUser(id) {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "DELETE",
  })
    .then(function () {
      getUserList();
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng tìm kiếm theo nhóm user (GV, HV...)
function searchUser() {
  var keyword = document
    .getElementById("searchName")
    .value.toLowerCase()
    .trim();

  var search = [];
  for (var i = 0; i < userList.length; i++) {
    var loaiND = userList[i].loaiND.toLowerCase();
    if (loaiND.includes(keyword)) {
      search.push(userList[i]);
    }
  }
  renderUser(search);
}

//hàm có chức năng lấy thông tin user cần sửa lên form modal
function getUpdateUser(id) {
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "GET",
  })
    .then(function (res) {
      var user = res.data;
      //lấy thông tin đối tượng lên giao diện form modal
      document.getElementById("id").value = user.id;
      document.getElementById("TaiKhoan").value = user.taiKhoan;
      document.getElementById("HoTen").value = user.hoTen;
      document.getElementById("MatKhau").value = user.matKhau;
      document.getElementById("Email").value = user.email;
      document.getElementById("loaiNguoiDung").value = user.loaiND;
      document.getElementById("loaiNgonNgu").value = user.ngonNgu;
      document.getElementById("MoTa").value = user.moTa;
      document.getElementById("HinhAnh").value = user.hinhAnh;

      document.getElementById("TaiKhoan").disabled = true; //không cho user sửa mã tài khoản
    })
    .catch(function (err) {
      console.log(err);
    });
}

//hàm có chức năng update thông tin user
function updateUser() {
  //Lấy thông tin người dùng nhập vô
  var id = document.getElementById("id").value
  var taiKhoan = document.getElementById("TaiKhoan").value;
  var hoTen = document.getElementById("HoTen").value;
  var matKhau = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var loaiND = document.getElementById("loaiNguoiDung").value;
  var ngonNgu = document.getElementById("loaiNgonNgu").value;
  var moTa = document.getElementById("MoTa").value;
  var hinhAnh = document.getElementById("HinhAnh").value;

  //tạo đối tượng user mới, đây là đối tượng sau khi đã chỉnh sửa
  var newUser = new User(
    taiKhoan,
    hoTen,
    matKhau,
    email,
    loaiND,
    ngonNgu,
    moTa,
    hinhAnh
  );

  //gửi đối tượng này xuống backend
  //Call API
  axios({
    url: "https://633ce4277e19b1782903a4e4.mockapi.io/User/" + id,
    method: "PUT",
    data: newUser,
  })
    .then(function () {
      getUserList();
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.onload = function () {
  getUserList();
};
