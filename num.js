window.onload = function () {
	//событие на клик chicle
	document.getElementById("chicle").onclick = function () {
		solver(chicle);
	};
	//событие на клик sieve
	document.getElementById("sieve").onclick = function () {
		solver(sieve);
	};
	//событие на клик chicle
	document.getElementById("chicle2").onclick = function () {
		solver(chicle2);
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
		i, j;
	//пробегаемся по всем числам
	loop:
		for (i = 2; i <= num; i++) {
			//пробегаемся по массиву простых чисел
			for (j = 0; j < symfnum.length; j++) {
				//если поделилось нацело, это фиаско, выходим
				if (i % symfnum[j] == 0) {
					continue loop;
				}
			}
			symfnum.push(i);
		}
	return symfnum;
}

//способ перебором
function chicle2(num) {
	var symfnum = [],
		i = 2,
		j, k,
		timer = performance.now(),
		progress = document.getElementById("status"),
		total = document.getElementById("total"),
		time = document.getElementById("time"),
		numb = document.getElementById("numb"),
		percent;
	//пробегаемся по всем числам с анимацией
	var forTime = setInterval(frame, 0);

	function frame() {
		if (i <= num) {
			//пробегаемся по массиву простых чисел
			k = true;
			for (j = 0; j < symfnum.length; j++) {
				//если поделилось нацело, это фиаско, выходим
				if (i % symfnum[j] == 0) {
					k = false;
					break;
				}
			}
			if (k) {
				symfnum.push(i);
				numb.innerHTML = symfnum.join(', ');
			}
			percent = Math.round(i / num * 10000) / 100 + "%";
			progress.innerHTML = percent;
			progress.style.width = percent;
			total.innerHTML = symfnum.length;
			time.innerHTML = performance.now() - timer;
			i++;
		} else {
			clearInterval(forTime);
		}
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