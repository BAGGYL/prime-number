window.onload = function () {
	//событие на клик chicle
	document.getElementById("chicle").onclick = function () {
		solver(chicle);
	};
	//событие на клик sieve
	document.getElementById("sieve").onclick = function () {
		solver(sieve);
	};
	//событие на клик chicleAnimation
	document.getElementById("chicleAnimation").onclick = function () {
		solver(chicleAnimation);
	};
	//событие на клик chicleWorker
	document.getElementById("chicleWorker").onclick = function () {
		solverWoker('chicle');
	};
	//событие на клик sieveWorker
	document.getElementById("sieveWorker").onclick = function () {
		solverWoker('sieve');
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
function solver(method) {
	var num = getNumb();
	window.clearAllTimeOut();
	//если число задано, то считаем
	if (num) {
		document.getElementById("status").innerHTML = '0%';
		document.getElementById("status").style.width = '0%';
		setTimeout(function () {
			var timer = performance.now();
			var result = method(num);
			timer = performance.now() - timer;
			document.getElementById("status").innerHTML = '100%';
			document.getElementById("status").style.width = '100%';
			document.getElementById("total").innerHTML = result.length;
			document.getElementById("numb").innerHTML = result.join(', ');
			document.getElementById("time").innerHTML = timer;
		}, 0);
	}
}

//Решатель через воркер
function solverWoker(method) {
	var num = getNumb();
	window.clearAllTimeOut();
	//если число задано, то считаем
	if (num) {
		const myWorker = new Worker("worker.js");
		document.getElementById("status").innerHTML = '0%';
		document.getElementById("status").style.width = '0%';
		myWorker.postMessage({
			method: method,
			num: num
		});
		myWorker.onmessage = function (e) {
			document.getElementById("status").innerHTML = e.data.percent;
			document.getElementById("status").style.width = e.data.percent;
			document.getElementById("time").innerHTML = e.data.timer;
			document.getElementById("total").innerHTML = e.data.length;
			document.getElementById("numb").innerHTML = e.data.primeNums;
		}
	}
}

//способ перебором
function chicle(num) {
	let symfnum = [],
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

//способ перебором c анимацией
function chicleAnimation(num) {
	let symfnum = [],
		i = 2,
		j, k,
		timer = performance.now(),
		progress = document.getElementById("status"),
		total = document.getElementById("total"),
		time = document.getElementById("time"),
		numb = document.getElementById("numb"),
		percent;
	//пробегаемся по всем числам с анимацией
	let forTime = setInterval(frame, 0);

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
	var sieve = [],
		result = [];

	sieve[1] = 0; // 1 - не простое число
	// заполняем решето единицами
	for (var i = 2; i <= num; i++) {
		sieve[i] = 1;
	}
	for (i = 2; i * i <= num; i++) {
		// если i - простое (не вычеркнуто)
		if (sieve[i] == 1) {
			// то вычеркнем кратные i
			for (let j = i * i; j <= num; j += i) {
				delete sieve[j];
			}
		}
	}
	//пересортировка
	sieve.forEach(function (element, index) {
		if (element) {
			result.push(index);
		}
	});
	return result;
}

//Остановка всех setTimeout
window.clearAllTimeOut = function () {
	for (var i = setTimeout(function () {}, 0); i > 0; i--) {
		window.clearInterval(i);
		window.clearTimeout(i);
	}
}