let message = {},
	primeNums = [],
	i, num,
	col = 0,
	timer = performance.now(),
	timeFrame = timer;

onmessage = function (e) {
	num = e.data.num;
	method = e.data.method;
	//Если метод расчета циклом
	if (method == 'chicle') {
		chicle();
		//Если метод расчета решетом
	} else if (method == 'sieve') {
		sieve();
	} else {
		console.error("Неизвестный метод");
		close();
	}
	pushFihish();
	close();
}

//Метод расчета циклом
function chicle() {
	//пробегаемся по всем числам
	loop: for (i = 2; i <= num; i++) {
		//пробегаемся по массиву простых чисел
		for (let j = 0; j < primeNums.length; j++) {
			//если поделилось нацело, это фиаско, выходим
			if (i % primeNums[j] == 0) {
				continue loop;
			}
		}
		primeNums.push(i);
		pushStatus();
	}
	i--;
}

//Метод расчета решетом
function sieve() {
	let sieve = [];

	sieve[1] = 0; // 1 - не простое число
	// заполняем решето единицами
	for (i = 2; i <= num; i++) {
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
		pushStatus();
	}
	//пересортировка
	sieve.forEach(function (element, index) {
		if (element) {
			primeNums.push(index);
		}
	});
}

//Функция отправки промежуточных вычислений
function pushStatus() {
	if (performance.now() - timeFrame >= 1000 / 20) {
		message = {
			percent: (i / num * 100).toFixed(1) + "%",
			primeNums: "Ожидание....",
			length: primeNums.length,
			timer: (performance.now() - timer)
		};
		postMessage(message);
		timeFrame = performance.now()
	}
}

//Функция отправки результатов расчета
function pushFihish() {
	message = {
		percent: "100%",
		primeNums: primeNums.join(', '),
		length: primeNums.length,
		timer: (performance.now() - timer)
	};
	postMessage(message);
}