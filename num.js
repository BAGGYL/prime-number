window.onload = function () {
    //событие на клик chicle
    document.getElementById("chicle").onclick = function () {
        solver(chicle);

    };

    //событие на клик sieve
    document.getElementById("sieve").onclick = function () {
        solver(sieve);
    };
};

//функция получения числи от пользователя и выдача предупреждения
function getNumb() {
    var number = document.getElementById("number");
    var num = +number.value;
    if (isNaN(num)) {
        alert("Введите число!");
    } else if (num <= 0) {
        alert("Введите положительное число!");
    } else {
        return num;
    }
    number.focus();
    number.value = "";
    return false;
}

//Решатель
function solver(metods) {
    var num = getNumb();
    //если число задано, то считаем
    if (num) {
        document.getElementById("status").innerHTML = '0%';
        document.getElementById("status").style.width = '0%';
        setTimeout(function () {
            var timer = performance.now();
            var result = metods(num);
            timer = performance.now() - timer;
            document.getElementById("status").innerHTML = '100%';
            document.getElementById("status").style.width = '100%';
            document.getElementById("total").innerHTML = result.length;
            document.getElementById("numb").innerHTML = result.join(', ');
            document.getElementById("time").innerHTML = timer;
        }, 0);
    }
}

//способ перебором
function chicle(num) {
    var symfnum = [],
        k = true,
        i, j;
    //пробегаемся по всем числам
    for (i = 2; i <= num; i++) {
        //пробегаемся по массиву простых чисел
        for (j = 0; j <= symfnum.length; j++) {
            //если поделилось нацело, это фиаско, выходим
            if (i % symfnum[j] == 0) {
                k = false;
                break;
            }
        }
        //проверяем на деление нацело после пробега цикла
        if (k) {
            symfnum.push(i);
        }
        k = true;
    }
    return symfnum;
}

//способ решето Эратосфена
function sieve(num) {
    var S = [],
        result = [];
    S[1] = 0; // 1 - не простое число
    // заполняем решето единицами
    for (k = 2; k <= num; k++) {
        S[k] = 1;
    }
    for (k = 2; k * k <= num; k++) {
        // если k - простое (не вычеркнуто)
        if (S[k] == 1) {
            // то вычеркнем кратные k
            for (l = k * k; l <= num; l += k) {
                S[l] = 0;
            }
        }
    }
    //пересортировка
    S.forEach(function (element, index) {
        if (element) {
            result.push(index);
        }
    });
    return result;
}